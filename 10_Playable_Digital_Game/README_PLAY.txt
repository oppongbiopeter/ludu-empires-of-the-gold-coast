LUDU: Empires of the Gold Coast — Digital Client (v3)
====================================================

OPEN: index.html

CORE PLAY
  Classic Ludu board · Gwent-style FX · cards · power-ups · leaders
  Vs AI (Easy/Normal/Hard, 1–3 AIs) · Hotseat 2–4

SOUND
  Web Audio synth SFX (dice, move, capture, cards, power, win/lose, UI)
  Toggle: "Sound: On/Off" on hub

CLOUD SAVE (login required)
  Upload / Download / Auto-sync
  CloudAPI-shaped layer — local vault now; set CloudAPI.base for real server

ONLINE MULTIPLAYER (scaffolding)
  Create/Join room · room codes · ready-check · quick match (simulated)
  NetAPI bus (simulated | future WebSocket)
  Start launches local table from lobby seats

LEADERBOARDS
  Global · Weekly · Seasonal · Friends · Clan Wars · By Faction
  Submit score (login) · Add friend (local)

CLANS & TEAMS
  Create clan (name + tag) · Join by tag · Leave
  Clan trophies · Clan Wars leaderboard
  Login required to create/join

ACCOUNT
  Guest play free · Login for saves, cloud, clans, LB submit, achievements persist

Production notes:
  - CloudAPI.base = your HTTPS API
  - NetAPI.connect(wss://...) for real multiplayer
  - Replace local vaults with server-authoritative stores
