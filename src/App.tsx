import { useState } from 'react';
import { ChildLayout } from './components/child/ChildLayout';
import { ParentLayout } from './components/parent/ParentLayout';
import { AuthModal } from './components/shared/AuthModal';
import { PinModal } from './components/shared/PinModal';
import { PrintReportModal } from './components/shared/PrintReportModal';
import { TennisStoreProvider, useTennisStore } from './lib/store';
import type { AppMode } from './types/tennis';

function AppShell() {
  const { state, setTabletLocked } = useTennisStore();

  const [mode, setMode] = useState<AppMode>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'enfant' || state.tabletLocked) {
      return 'child';
    }
    return 'parent';
  });

  const [showPinModal, setShowPinModal] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSwitchToChild = (lockTablet = false) => {
    if (lockTablet) {
      setTabletLocked(true);
    }
    setMode('child');
  };

  const handleRequestParentMode = () => {
    setShowPinModal(true);
  };

  const handlePinVerified = () => {
    setShowPinModal(false);
    setMode('parent');
  };

  return (
    <>
      {mode === 'child' ? (
        <ChildLayout onRequestParentMode={handleRequestParentMode} />
      ) : (
        <ParentLayout
          onSwitchToChild={handleSwitchToChild}
          onOpenPrintReport={() => setShowPrintReport(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
        />
      )}

      {showPinModal && (
        <PinModal
          expectedPin={state.parentPin}
          title={state.tabletLocked ? 'Déverrouiller la Tablette' : 'Accès Espace Parent'}
          subtitle="Saisis le code PIN Parent à 4 chiffres."
          onSuccess={handlePinVerified}
          onClose={() => setShowPinModal(false)}
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
