# 🎾 Galaxie Tennis — Suivi Familial & Aventure Enfant

Application web progressive (PWA) conçue pour suivre la progression au tennis d’une jeune joueuse (6–9 ans, référentiel **FFT Galaxie Tennis**), avec **deux interfaces distinctes** :

1. **Espace Gestion Parent & Coach** (style sobre *Terre Battue / Roland-Garros*) :
   - Tableau de bord avec **boîte de validations en 1 clic** (défis terminés & demandes de récompenses de votre enfant)
   - Radar des **6 piliers techniques** (Coup droit, Revers, Service, Volée, Jeu de jambes, Plaisir & Fair-play)
   - Checklist officielle **Galaxie Tennis** (Blanc → Violet → Rouge → Orange → Vert)
   - **Journal de séances rapide (30 secondes)** avec notes coach/parent + affichage du ressenti de l’enfant
   - **Défis de la semaine** (avec modèles 1 clic) & **Boutique de récompenses réelles** personnalisable
   - **Plateaux Galaxie** (souvenirs positifs sans pression) & **Galerie Photos / Vidéos**
   - **Carnet pratique** (raquette, pointure, horaires, contact coach, calendrier) + **Fiche Bilan Imprimable / PDF**
   - Support **multi-enfants**, **Code PIN Parent à 4 chiffres** et **Mode « Tablette Enfant » verrouillable**

2. **Univers Ludique Enfant** (solaire, tactile et personnalisable — 3 thèmes au choix : *Terre Battue*, *Galaxie*, *Gazon*) :
   - **Carte d’Aventure Galaxie Tennis** (5 planètes de balles à explorer avec étapes et étoiles)
   - **Check-in Humeur** après séance (+5 ⭐ bonus)
   - **Mes Défis de la Semaine** avec bouton « J’ai réussi ! 🎉 » envoyé au Parent
   - **Studio Avatar & Équipement** (coiffure, tenues, bandeaux, raquettes, mascottes débloquées avec ses étoiles)
   - **Vitrine à Trophées (12 badges)** & **Album Souvenirs**
   - **Boutique de Récompenses réelles** (glace, film du vendredi, surgrip coloré...)
   - **Mini-Quiz Tennis illustré** (avec plafond quotidien d’étoiles bonus : 15 ⭐/jour)

---

## 🚀 Tester immédiatement (Mode Démo Local)

L’application embarque un **Mode Démo Local** complet (données enregistrées dans `localStorage`, profil modifiable en 1 clic, export/import JSON) — aucune configuration cloud n’est nécessaire pour démarrer :

```bash
npm install
npm run dev
```

- **Code PIN Parent par défaut** : `1234` (modifiable dans *Carnet & Réglages*)
- **Astuce tablette** : ajoutez `?mode=enfant` à l’URL ou activez **« Verrouiller Tablette Enfant »** depuis la barre latérale Parent.

---

## ☁️ Activer la synchronisation Cloud multi-appareils (Supabase gratuit)

Pour synchroniser en temps réel **ton téléphone Parent** et **la tablette de ta fille** :

1. Crée un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor → New Query**, colle et exécute l’intégralité du fichier [`supabase/schema.sql`](./supabase/schema.sql).
   - Cela crée les 10 tables, les règles de sécurité **Row Level Security (RLS)**, le bucket Storage `tennis-memories` pour les photos, et la synchronisation **Realtime**.
3. Récupère tes clés dans **Project Settings → API** :
   - `Project URL`
   - `anon public key`
4. **Deux façons de connecter l’app :**
   - **Option A (Recommandée pour déploiement Vercel)** : ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env` (ou dans les variables d’environnement Vercel).
   - **Option B (Directement depuis l’interface)** : clique sur **« Mode Démo Local / Configurer »** dans l’espace Parent et colle les deux clés, puis crée ton compte famille (email/mot de passe).
5. Connecte-toi avec le **même compte famille** sur la tablette de ta fille, puis clique sur **« Verrouiller Tablette Enfant »**.

---

## 🌍 Déployer en 2 clics sur Vercel

1. Rends-toi sur [vercel.com/new](https://vercel.com/new) et importe ce dépôt GitHub (`galaxie-tennis-suivi`).
2. Ajoute optionnellement les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
3. Clique sur **Deploy** — le fichier `vercel.json` et la configuration PWA sont déjà prêts !
4. Sur iPhone / iPad (Safari) ou Android (Chrome), utilise **« Ajouter à l’écran d’accueil »** pour l’installer comme une vraie application native.
