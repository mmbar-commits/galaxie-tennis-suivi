import { useState } from 'react';
import { ChildLayout } from './components/child/ChildLayout';
import { CoachView } from './components/coach/CoachView';
import { ParentLayout } from './components/parent/ParentLayout';
import { AuthModal } from './components/shared/AuthModal';
import { PinModal } from './components/shared/PinModal';
import { PrintReportModal } from './components/shared/PrintReportModal';
import { TennisStoreProvider, useTennisStore } from './lib/store';
import type { AppMode } from './types/tennis';

function AppShell() {
  const { state, setTabletLocked } = useTennisStore();

  const [initialUrlMode] = useState(() => new URLSearchParams(window.location.search).get('mode'));

  const [mode, setMode] = useState<AppMode>(() => {
    if (initialUrlMode === 'enfant' || state.tabletLocked) {
      return 'child';
    }
    if (initialUrlMode === 'coach') {
      return 'child';
    }
    return 'parent';
  });

  // If opened directly via ?mode=coach, prompt Coach PIN immediately
  const [pinTarget, setPinTarget] = useState<'parent' | 'coach' | null>(() =>
    initialUrlMode === 'coach' ? 'coach' : null,
  );
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSwitchToChild = (lockTablet = false) => {
    if (lockTablet) {
      setTabletLocked(true);
    }
    setMode('child');
  };

  const handleSwitchToCoach = () => {
    setMode('coach');
  };

  const handleRequestParentMode = () => {
    setPinTarget('parent');
  };

  const handlePinVerified = () => {
    const target = pinTarget;
    setPinTarget(null);
    if (target === 'coach') {
      setMode('coach');
    } else if (target === 'parent') {
      setMode('parent');
    }
  };

  return (
    <>
      {mode === 'child' && <ChildLayout onRequestParentMode={handleRequestParentMode} />}

      {mode === 'coach' && (
        <CoachView
          onRequestParentMode={handleRequestParentMode}
          onSwitchToChild={() => handleSwitchToChild(false)}
        />
      )}

      {mode === 'parent' && (
        <ParentLayout
          onSwitchToChild={handleSwitchToChild}
          onSwitchToCoach={handleSwitchToCoach}
          onOpenPrintReport={() => setShowPrintReport(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
        />
      )}

      {pinTarget === 'parent' && (
        <PinModal
          expectedPin={state.parentPin}
          defaultDemoPin="1234"
          title={state.tabletLocked ? 'Déverrouiller la Tablette' : 'Accès Espace Parent'}
          subtitle="Saisis le code PIN Parent à 4 chiffres."
          onSuccess={handlePinVerified}
          onClose={() => setPinTarget(null)}
        />
      )}

      {pinTarget === 'coach' && (
        <PinModal
          expectedPin={state.coachPin}
          defaultDemoPin="0000"
          title="Accès Espace Coach"
          subtitle="Saisis le code PIN Coach à 4 chiffres pour valider les acquis TTCA."
          onSuccess={handlePinVerified}
          onClose={() => setPinTarget(null)}
        />
      )}

      {showPrintReport && <PrintReportModal onClose={() => setShowPrintReport(false)} />}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default function App() {
  return (
    <TennisStoreProvider>
      <AppShell />
    </TennisStoreProvider>
  );
}
