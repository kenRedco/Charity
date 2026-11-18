import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAward,
  FiCheckCircle,
  FiDownload,
  FiExternalLink,
  FiHeart,
  FiLock,
  FiLogOut,
  FiMail,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';
import PageMeta from '../components/PageMeta';
import usePageTitle from '../hooks/usePageTitle';
import { SITE_BASENAME } from '../config';
import { supabase, supabaseConfigured } from '../lib/supabase';

const EMPTY_PREFERENCES = {
  anonymous_by_default: true,
  email_donation_updates: false,
  email_impact_updates: false,
};

const MILESTONES = [
  { count: 1, title: 'First gift', detail: 'Your first verified on-chain contribution' },
  { count: 5, title: 'Steady supporter', detail: 'Five verified contributions' },
  { count: 10, title: 'Lasting impact', detail: 'Ten verified contributions' },
  { count: 25, title: 'Giving champion', detail: 'Twenty-five verified contributions' },
];

function formatDate(value) {
  if (!value) return 'Awaiting confirmation';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
}

function downloadReceipt(donation) {
  const contents = [
    'CRYPTOCHARITY DONATION RECEIPT',
    '',
    `Status: ${donation.verification_status === 'verified' ? 'Verified on-chain' : 'Pending network confirmation'}`,
    `Date: ${formatDate(donation.confirmed_at || donation.created_at)}`,
    `Amount: ${donation.amount ? `${donation.amount} ${donation.symbol}` : 'Pending confirmation'}`,
    `Network: ${donation.network}`,
    `Transaction: ${donation.transaction_hash}`,
    `Recipient: ${donation.recipient_address || 'Pending confirmation'}`,
    `Project: ${donation.project?.name || 'Not specified'}`,
    `Recognition preference: ${donation.is_anonymous ? 'Anonymous' : 'Not anonymous; no public profile is published'}`,
    '',
    'This receipt records the on-chain transfer details shown above. It is not a tax-deductibility determination.',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `cryptocharity-receipt-${donation.network.toLowerCase()}-${donation.transaction_hash.slice(0, 10)}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function StatusNotice({ children, error = false }) {
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={`mt-4 rounded-xl px-4 py-3 text-sm ${
        error
          ? 'border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200'
          : 'border border-leaf/20 bg-leaf/5 text-forest dark:text-sage'
      }`}
    >
      {children}
    </p>
  );
}

function AuthPanel() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const sendLink = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    setNotice('');
    const redirectTo = `${window.location.origin}${SITE_BASENAME}/dashboard`;
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (authError) throw authError;
      setNotice(
        'If this address can receive sign-in links, one is on its way. Follow it on this device to open your private dashboard.'
      );
    } catch {
      setError('We could not send a sign-in link. Check the email address and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-forest/10 bg-white/90 p-6 shadow-[0_24px_70px_rgba(23,58,48,0.12)] dark:border-white/10 dark:bg-gray-900/90 sm:p-10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/8 text-forest dark:bg-sage/10 dark:text-sage">
        <FiLock aria-hidden="true" className="h-6 w-6" />
      </div>
      <h2 className="text-3xl font-semibold text-forest dark:text-white">
        Your giving, kept private.
      </h2>
      <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
        Sign in or create an account with an email link. No password is stored by this site.
      </p>
      <form className="mt-7" onSubmit={sendLink}>
        <label
          htmlFor="donor-email"
          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          Email address
        </label>
        <input
          id="donor-email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-forest/15 bg-paper px-4 py-3 text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/30 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={sending}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3.5 font-semibold text-white transition hover:bg-coral/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
        >
          <FiMail aria-hidden="true" />
          {sending ? 'Sending sign-in link…' : 'Email me a secure sign-in link'}
        </button>
      </form>
      {notice && <StatusNotice>{notice}</StatusNotice>}
      {error && <StatusNotice error>{error}</StatusNotice>}
      <p className="mt-6 flex gap-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        <FiShield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        Donation records are visible only to the signed-in account. Blockchain transaction details
        remain public on their networks.
      </p>
    </div>
  );
}

export default function DonorDashboard() {
  usePageTitle('Donor Dashboard');
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [donations, setDonations] = useState([]);
  const [preferences, setPreferences] = useState(EMPTY_PREFERENCES);
  const [preferencesDirty, setPreferencesDirty] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyDonationId, setBusyDonationId] = useState('');

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return undefined;
    }

    let active = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error)
          setPageError('Could not restore your sign-in session. Please try signing in again.');
        setSession(data.session);
        setCheckingSession(false);
      })
      .catch(() => {
        if (!active) return;
        setPageError('Could not restore your sign-in session. Please try signing in again.');
        setCheckingSession(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setPageError('');
        setNotice('');
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id;

  const loadDashboard = useCallback(async () => {
    if (!supabase || !userId) return;
    setLoadingDashboard(true);
    setPageError('');
    try {
      const [donationResult, preferenceResult] = await Promise.all([
        supabase
          .from('donations')
          .select(
            'id,network,transaction_hash,symbol,amount,recipient_address,verification_status,confirmed_at,explorer_url,is_anonymous,created_at,project_id,project:projects!donations_project_id_fkey(id,slug,name,description)'
          )
          .order('created_at', { ascending: false }),
        supabase
          .from('donor_preferences')
          .select('anonymous_by_default,email_donation_updates,email_impact_updates')
          .eq('user_id', userId)
          .maybeSingle(),
      ]);

      if (donationResult.error || preferenceResult.error) {
        setPageError('We could not load your private dashboard. Please refresh and try again.');
        return;
      }
      setDonations(donationResult.data || []);
      setPreferences({ ...EMPTY_PREFERENCES, ...(preferenceResult.data || {}) });
      setPreferencesDirty(false);
    } catch {
      setPageError('We could not load your private dashboard. Please refresh and try again.');
    } finally {
      setLoadingDashboard(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadDashboard();
  }, [userId, loadDashboard]);

  const verifiedDonations = useMemo(
    () => donations.filter((donation) => donation.verification_status === 'verified'),
    [donations]
  );
  const supportedProjects = useMemo(() => {
    const projects = new Map();
    verifiedDonations.forEach((donation) => {
      if (donation.project) projects.set(donation.project.id, donation.project);
    });
    return Array.from(projects.values());
  }, [verifiedDonations]);
  const earnedMilestones = MILESTONES.filter(
    (milestone) => verifiedDonations.length >= milestone.count
  );
  const nextMilestone = MILESTONES.find((milestone) => verifiedDonations.length < milestone.count);

  const savePreferences = async () => {
    if (!supabase || !session?.user) return;
    setSavingPreferences(true);
    setNotice('');
    try {
      const { error } = await supabase.from('donor_preferences').upsert(
        {
          user_id: session.user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      setPreferencesDirty(false);
      setNotice('Your preferences have been saved privately.');
    } catch {
      setPageError(
        'Your privacy and notification preferences could not be saved. Please try again.'
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const setPreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setPreferencesDirty(true);
    setNotice('');
  };

  const verifyPendingDonation = async (donation) => {
    if (!supabase) return;
    setBusyDonationId(donation.id);
    setPageError('');
    try {
      const { error } = await supabase.functions.invoke('verify-donation', {
        body: {
          network: donation.network,
          txHash: donation.transaction_hash,
          isAnonymous: donation.is_anonymous,
          projectId: donation.project_id || null,
        },
      });
      if (error) throw error;
      setNotice('Transaction status refreshed from the blockchain.');
      await loadDashboard();
    } catch {
      setPageError('We could not refresh this transaction right now. Please try again later.');
    } finally {
      setBusyDonationId('');
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      setPageError('Could not sign out. Please try again.');
    }
  };

  if (!supabaseConfigured) {
    return (
      <div className="min-h-[70vh] bg-paper px-5 pb-20 pt-32 dark:bg-gray-950 sm:px-8">
        <PageMeta
          title="Donor Dashboard"
          description="Private CryptoCharity donor dashboard."
          path="/dashboard"
        />
        <div className="mx-auto max-w-3xl rounded-3xl border border-coral/20 bg-white p-8 text-center shadow-xl dark:bg-gray-900 sm:p-12">
          <FiShield aria-hidden="true" className="mx-auto h-12 w-12 text-coral" />
          <h1 className="mt-5 text-3xl font-semibold text-forest dark:text-white">
            Dashboard setup required
          </h1>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
            Secure donor accounts are not enabled yet. Add the public Supabase project URL and
            publishable key to the site configuration, then apply the included database migration
            and verification function.
          </p>
          <Link
            to="/donate"
            className="mt-7 inline-flex rounded-xl bg-coral px-6 py-3 font-semibold text-white hover:bg-coral/90"
          >
            Continue to donate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-4 pb-20 pt-28 dark:bg-gray-950 sm:px-6 lg:px-8">
      <PageMeta
        title="Donor Dashboard"
        description="A private dashboard for your verified CryptoCharity donations, receipts, and preferences."
        path="/dashboard"
      />
      <div className="mx-auto max-w-7xl">
        {!session || checkingSession ? (
          <section className="py-10 sm:py-16" aria-labelledby="donor-welcome-title">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="eyebrow mb-3 text-leaf">A private space for your giving</p>
              <h1
                id="donor-welcome-title"
                className="text-4xl font-semibold text-forest dark:text-white sm:text-5xl"
              >
                Your donor dashboard
              </h1>
              <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
                Review verified contributions, track milestones, download receipts, and manage your
                privacy and email preferences.
              </p>
            </div>
            {checkingSession ? (
              <div
                className="mx-auto max-w-xl animate-pulse rounded-3xl bg-white/80 p-12 dark:bg-gray-900/80"
                aria-label="Checking sign-in status"
              />
            ) : (
              <AuthPanel />
            )}
            {pageError && (
              <div className="mx-auto max-w-xl">
                <StatusNotice error>{pageError}</StatusNotice>
              </div>
            )}
          </section>
        ) : (
          <>
            <header className="flex flex-col gap-5 border-b border-forest/10 pb-7 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-2 text-leaf">Private donor space</p>
                <h1 className="text-4xl font-semibold text-forest dark:text-white sm:text-5xl">
                  Your giving dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{session.user.email}</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-forest/15 px-4 py-2.5 font-semibold text-forest transition hover:bg-forest/5 dark:border-white/15 dark:text-white dark:hover:bg-white/5 sm:self-auto"
              >
                <FiLogOut aria-hidden="true" /> Sign out
              </button>
            </header>

            {pageError && <StatusNotice error>{pageError}</StatusNotice>}
            {notice && <StatusNotice>{notice}</StatusNotice>}

            <section aria-label="Donation overview" className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Verified contributions',
                  value: verifiedDonations.length,
                  Icon: FiCheckCircle,
                },
                { label: 'Supported projects', value: supportedProjects.length, Icon: FiHeart },
                { label: 'Milestones earned', value: earnedMilestones.length, Icon: FiAward },
              ].map(({ label, value, Icon }) => (
                <article
                  key={label}
                  className="rounded-2xl border border-forest/10 bg-white/85 p-5 dark:border-white/10 dark:bg-gray-900/85"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 text-leaf" />
                  <p className="mt-4 text-3xl font-semibold tabular-nums text-forest dark:text-white">
                    {value}
                  </p>
                  <h2 className="mt-1 text-sm text-gray-600 dark:text-gray-300">{label}</h2>
                </article>
              ))}
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <section
                className="min-w-0 rounded-3xl border border-forest/10 bg-white/85 p-5 dark:border-white/10 dark:bg-gray-900/85 sm:p-7"
                aria-labelledby="donation-history-title"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow text-leaf">On-chain activity</p>
                    <h2
                      id="donation-history-title"
                      className="mt-1 text-2xl font-semibold text-forest dark:text-white"
                    >
                      Donation history
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={loadDashboard}
                    disabled={loadingDashboard}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-forest hover:bg-forest/5 disabled:opacity-50 dark:text-sage dark:hover:bg-white/5"
                  >
                    <FiRefreshCw
                      aria-hidden="true"
                      className={loadingDashboard ? 'animate-spin' : ''}
                    />{' '}
                    Refresh
                  </button>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Only transactions confirmed at a configured CryptoCharity wallet are marked
                  verified. Contributions sent while signed out or through an external payment app
                  cannot be automatically linked to this account.
                </p>

                {loadingDashboard ? (
                  <div
                    className="mt-6 animate-pulse space-y-3"
                    aria-label="Loading donation history"
                  >
                    <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800" />
                    <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800" />
                  </div>
                ) : donations.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-forest/20 px-5 py-9 text-center dark:border-white/15">
                    <FiTrendingUp aria-hidden="true" className="mx-auto h-8 w-8 text-leaf" />
                    <h3 className="mt-3 font-semibold text-gray-800 dark:text-white">
                      Your verified gifts will appear here
                    </h3>
                    <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
                      Sign in before making an on-site wallet donation so its transaction can be
                      checked and privately linked to your account.
                    </p>
                    <Link
                      to="/donate"
                      className="mt-4 inline-flex rounded-lg bg-coral px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral/90"
                    >
                      Make a donation
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {donations.map((donation) => (
                      <li
                        key={donation.id}
                        className="rounded-2xl border border-forest/10 p-4 dark:border-white/10 sm:p-5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {donation.amount
                                  ? `${donation.amount} ${donation.symbol}`
                                  : `Pending ${donation.symbol}`}
                              </h3>
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${donation.verification_status === 'verified' ? 'bg-leaf/10 text-forest dark:text-sage' : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'}`}
                              >
                                {donation.verification_status === 'verified'
                                  ? 'Verified'
                                  : 'Pending confirmation'}
                              </span>
                              {donation.is_anonymous && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                  Anonymous
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {donation.network} ·{' '}
                              {formatDate(donation.confirmed_at || donation.created_at)}
                            </p>
                            <p
                              className="mt-2 truncate font-mono text-xs text-gray-600 dark:text-gray-300"
                              title={donation.transaction_hash}
                            >
                              {donation.transaction_hash}
                            </p>
                            {donation.project?.name && (
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Project: {donation.project.name}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            {donation.verification_status === 'pending' ? (
                              <button
                                type="button"
                                onClick={() => verifyPendingDonation(donation)}
                                disabled={busyDonationId === donation.id}
                                className="inline-flex items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-sm font-semibold text-forest hover:bg-forest/5 disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
                              >
                                <FiRefreshCw
                                  aria-hidden="true"
                                  className={busyDonationId === donation.id ? 'animate-spin' : ''}
                                />{' '}
                                Check status
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => downloadReceipt(donation)}
                                className="inline-flex items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-sm font-semibold text-forest hover:bg-forest/5 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
                              >
                                <FiDownload aria-hidden="true" /> Receipt
                              </button>
                            )}
                            {donation.explorer_url && (
                              <a
                                href={donation.explorer_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white hover:bg-forest/90"
                              >
                                Explorer <FiExternalLink aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <div className="space-y-6">
                <section
                  className="rounded-3xl border border-forest/10 bg-white/85 p-5 dark:border-white/10 dark:bg-gray-900/85 sm:p-7"
                  aria-labelledby="projects-title"
                >
                  <p className="eyebrow text-leaf">Your impact</p>
                  <h2
                    id="projects-title"
                    className="mt-1 text-2xl font-semibold text-forest dark:text-white"
                  >
                    Supported projects
                  </h2>
                  {supportedProjects.length ? (
                    <ul className="mt-5 space-y-3">
                      {supportedProjects.map((project) => (
                        <li key={project.id} className="rounded-xl bg-paper p-4 dark:bg-gray-950">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                              {project.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      Project details will appear here when verified donations are linked to an
                      active project.
                    </p>
                  )}
                </section>

                <section
                  className="rounded-3xl border border-forest/10 bg-white/85 p-5 dark:border-white/10 dark:bg-gray-900/85 sm:p-7"
                  aria-labelledby="milestones-title"
                >
                  <p className="eyebrow text-leaf">Every gift matters</p>
                  <h2
                    id="milestones-title"
                    className="mt-1 text-2xl font-semibold text-forest dark:text-white"
                  >
                    Contribution milestones
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {verifiedDonations.length} verified{' '}
                    {verifiedDonations.length === 1 ? 'contribution' : 'contributions'}
                  </p>
                  {nextMilestone && (
                    <p className="mt-3 rounded-xl bg-leaf/5 p-3 text-sm text-forest dark:text-sage">
                      {nextMilestone.count - verifiedDonations.length} more to reach{' '}
                      {nextMilestone.title.toLowerCase()}.
                    </p>
                  )}
                  <ul className="mt-4 space-y-3">
                    {MILESTONES.map((milestone) => {
                      const achieved = verifiedDonations.length >= milestone.count;
                      return (
                        <li
                          key={milestone.count}
                          className={`flex items-center gap-3 rounded-xl p-3 ${achieved ? 'bg-leaf/5' : 'bg-gray-50 dark:bg-gray-950'}`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${achieved ? 'bg-leaf text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                          >
                            <FiAward aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                              {milestone.title}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {milestone.detail}
                            </span>
                          </span>
                          {achieved && (
                            <FiCheckCircle
                              aria-label="Achieved"
                              className="ml-auto shrink-0 text-leaf"
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>
            </div>

            <section
              className="mt-8 rounded-3xl border border-forest/10 bg-white/85 p-5 dark:border-white/10 dark:bg-gray-900/85 sm:p-7"
              aria-labelledby="privacy-title"
            >
              <div className="flex items-start gap-3">
                <FiShield aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-leaf" />
                <div>
                  <p className="eyebrow text-leaf">You are in control</p>
                  <h2
                    id="privacy-title"
                    className="mt-1 text-2xl font-semibold text-forest dark:text-white"
                  >
                    Privacy & notifications
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    Your account history is private. This site does not publish donor details.
                    Anonymity preferences do not hide a wallet address or transaction from the
                    public blockchain.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    key: 'anonymous_by_default',
                    label: 'Mark future gifts anonymous',
                    detail: 'Record gifts as anonymous by default.',
                  },
                  {
                    key: 'email_donation_updates',
                    label: 'Donation status updates',
                    detail: 'Opt in to email about confirmations.',
                  },
                  {
                    key: 'email_impact_updates',
                    label: 'Impact updates',
                    detail: 'Opt in to occasional project news.',
                  },
                ].map((preference) => (
                  <label
                    key={preference.key}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-forest/10 p-4 dark:border-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={preferences[preference.key]}
                      onChange={(event) => setPreference(preference.key, event.target.checked)}
                      className="mt-1 h-4 w-4 accent-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {preference.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {preference.detail}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={savePreferences}
                  disabled={!preferencesDirty || savingPreferences}
                  className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPreferences ? 'Saving…' : 'Save preferences'}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email choices are stored securely. The organization must configure a notification
                  sender before email alerts can be delivered.
                </p>
              </div>
              <p className="mt-5 flex gap-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                <FiLock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                Privacy controls apply to this account and optional recognition. Public blockchain
                records cannot be deleted or made private.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
