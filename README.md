# Ludu: Empires of the Gold Coast

**Classic Ghanaian Ludu × Gwent-inspired tactics** — a romanticized high-fantasy board game set in the empires of the Gold Coast.

Race four tokens to the **Golden Stool**. Capture by strength. Play weather, spies, medics, horns, and once-per-game **leader** abilities. Optional login unlocks cloud save, achievements, clans, and leaderboards.

---

## Play the digital game (browser)

```bash
# open the HTML5 client — no build step
open 10_Playable_Digital_Game/index.html
# or serve locally:
cd 10_Playable_Digital_Game && python3 -m http.server 8080
# then visit http://localhost:8080
```

**Demo deep-links**

| URL | Screen |
|-----|--------|
| `index.html` | Hub |
| `index.html?demo=game` | Mid-match demo table |
| `index.html?demo=mp` | Multiplayer lobby |
| `index.html?demo=lb` | Leaderboards |
| `index.html?demo=clan` | Clans |

---

## What’s in this repo

| Folder | Contents |
|--------|----------|
| `00_README_and_Marketing.txt` | Full design notes + marketing copy |
| `01_Logo_and_Branding` | Logo |
| `02_Game_Board` | Stylized classic Ludu board + home bases |
| `03_Leaders` | Osei Tutu I, Naa Gbewaa, Nana Kobina Ansa, Togbui Sri |
| `04_Cards` | Weather, spies, medics, specials, utility |
| `05_Tokens_and_Components` | Tokens, dice, power-up tiles |
| `06_Rulebook` | Rulebook pages / layouts |
| `07_Marketing_and_Promo` | Box art, poster, banners |
| `08_Expansion` | Expansion concepts |
| `09_Digital_and_Extras` | Extras |
| `10_Playable_Digital_Game` | **Playable HTML5/JS game** + art assets + screenshots |

### Digital game features

- Classic Ludu path race + strength combat  
- Gwent-style hand (weather, spies, medics, scorch, horn, elephant…)  
- 4 empires with leaders & color schemes  
- Vs AI (**Easy / Normal / Hard**) + 4-player hotseat  
- Online multiplayer scaffolding (room codes, ready-check)  
- Optional login → progress, achievements, social share  
- Cloud save scaffolding, clans/teams, multiple leaderboards  
- Web Audio SFX, Gwent-inspired UI animations  
- Play previews under `10_Playable_Digital_Game/play_preview/`

---

## Empires

| Empire | Color | Leader |
|--------|-------|--------|
| **Ashanti** | Gold | Osei Tutu I |
| **Dagbon** | Blue | Naa Gbewaa |
| **Fante** | Teal | Nana Kobina Ansa |
| **Ewe** | Purple | Togbui Sri |

---

## How a turn works

1. **Roll** two dice  
2. **Move** a token (leave yard, advance, enter home stretch)  
3. **Capture** if your strength ≥ foe on the same tile  
4. **Power tiles** fire on landing (wind, rain, mist, fire, drum, heal)  
5. **Play tactics cards** from your hand  
6. **Leader** ability once per game · doubles = extra turn  
7. First player to seat **all 4 tokens** on the Golden Stool wins  

---

## License / credit

Original game design & generative art package for **Ludu: Empires of the Gold Coast**.  
Inspired by traditional Ghanaian *Ludu* and the tactical spirit of *Gwent* (The Witcher).  
Not affiliated with CD Projekt Red or any official Ghanaian institution.

---

*Race for the Stool. · Gwent-inspired tactics. · Classic Ludu soul.*
