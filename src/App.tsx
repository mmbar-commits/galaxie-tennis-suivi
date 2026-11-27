import { useState } from 'react';
import { AdminView } from './components/admin/AdminView';
import { LoginScreen } from './components/auth/LoginScreen';
import { ChildLayout } from './components/child/ChildLayout';
import { CoachView } from './components/coach/CoachView';
import { ParentLayout } from './components/parent/ParentLayout';
import { AuthModal } from './components/shared/AuthModal';
import { PinModal } from './components/shared/PinModal';
import { PrintReportModal } from './components/shared/PrintReportModal';
import { TennisStoreProvider, useTennisStore } from './lib/store';

function AppShell() {
  const { state, currentUser, setTabletLocked } = useTennisStore();

  const [initialUrlMode] = useState(() => new URLSearchParams(window.location.search).get('mode'));

  // Child view override (when parent/coach switches to Child View or tablet is locked)
  const [childViewActive, setChildViewActive] = useState<boolean>(() => {
    return (initialUrlMode === 'enfant' || state.tabletLocked) && state.children.length > 0;
  });

  const [showPinModal, setShowPinModal] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSwitchToChild = (lockTablet = false) => {
    if (lockTablet) {
      setTabletLocked(true);
    }
    setChildViewActive(true);
  };

  const handleRequestExitChild = () => {
    if (currentUser?.role === 'coach' || currentUser?.role === 'admin') {
      setChildViewActive(false);
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinVerified = () => {
    setShowPinModal(false);
    setChildViewActive(false);
  };

  return (
    <>
      {childViewActive ? (
        <ChildLayout onRequestParentMode={handleRequestExitChild} />
      ) : !currentUser ? (
        <LoginScreen onOpenChildDemo={() => handleSwitchToChild(false)} />
      ) : currentUser.role === 'admin' ? (
        <AdminView />
      ) : currentUser.role === 'coach' ? (
        <CoachView onSwitchToChild={() => handleSwitchToChild(false)} />
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
          defaultDemoPin="1234"
          title={state.tabletLocked ? 'Déverrouiller la Tablette' : 'Retour Espace Parent'}
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
