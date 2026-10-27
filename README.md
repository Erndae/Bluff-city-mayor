# Bluff City Mayor

A city-management game set in Memphis, Tennessee. You play the mayor. You handle problems at real places on a real map of the city, write the city budget, win votes from the 13-member City Council, and run for re-election.

**Play it:** https://erndae.github.io/Bluff-city-mayor/ (once GitHub Pages is turned on, see below)

## How to play

| Control | What it does |
|---|---|
| WASD / arrow keys | Pan the map (hold Shift to go faster) |
| Mouse at screen edge | Scroll the map (can be turned off under Layers) |
| Scroll wheel | Zoom toward the cursor. Zoom out for the political map of council districts; zoom in and the city tilts into 3D |
| Click | Open a landmark, an amber issue pin, a council district or a police precinct |
| 1–6 | Map modes: City, Political, Council opinion, Street condition, MPD precincts, Region |
| Space | Pause / resume time |
| + / − | Change speed (1–5) |
| N | Skip to the end of the month |
| B / C / V / L / H | Budget office / Council chamber / Whip count / Map layers / Guide |

**Your mayor is a character.** Start by naming your mayor and choosing their look, up to 3 traits (at most one background, such as Former Police Officer or Community Organizer) and 22 skill points across six skills: Diplomacy, Stewardship, Intrigue, Public Safety, Learning and Charisma. No skill can start above 14. Skills shape council opinion, revenue, crime, school results, approval and how often your hooks leak. Like CK3, they grow with experience: from the work you do, from a monthly lifestyle focus, and from training. Click your portrait at the top left to see them.

**The council are characters.** Each of the 13 members has a portrait, traits (Ambitious, Loyal, Frugal, Reformer, Ward Boss, Vengeful, Gregarious, Pragmatic, Stubborn), a home district and an opinion of you from −100 to +100. Click a member to see every reason behind that number. Reasons fade over time. You get 3 private meetings a month, and you can fund a $1M project in a member's district every 6 months, though Frugal members resent the pork.

**Favors and hooks.** Members owe you favors when you grant their requests (blue pins in their home districts, often naming real poorly rated roads from the city's pavement data), fund their district projects, or quietly protect them. Your inspector general's confidential memos can give you a hook on a member. Before a vote, open the whip count (V) to see who's with you, who's leaning and who's against. You can call in a favor or use a hook to lock a vote. Hooks have a 30% chance to leak.

**Neighboring cities.** Bartlett, Germantown, Collierville, Arlington, Lakeland and Millington are separate cities with their own governments, outlined on the map at their official boundaries. Like neighboring realms in CK3, each has a mayor (fictional) with traits and a relations score. You can meet them, co-host events, and handle shared issues: fire and EMS mutual aid, annexation reserves, the three Germantown schools still run by MSCS, a backup water connection, a bus line to Wolfchase, a corporate headquarters fight with Collierville, sewer capacity for Arlington, a retail site in Lakeland, and the Navy base in Millington. Good relations lift the regional economy. Bad relations can send the suburban mayors to Nashville against you.

**Real-time clock.** Like CK3, time runs day by day. Pause with Space and set the speed from 1 to 5. New business arrives on random days and pauses the game (you can turn that off). Budget season, the June budget vote and elections also pause the clock. Each month closes into the Ledger.

The fiscal year runs July–June. You write the next budget in April, the council votes in June (7 of 13 votes to pass), and the city election is in October 2027.

## What's real

- **Map:** everything comes from the City of Memphis's public GIS services (maps.memphistn.gov, gis.memphistn.gov), downloaded October 2026. That covers 53,186 street segments, 304,547 building footprints (with heights for larger buildings), city limits, the Mississippi River, creeks, parks, railroads, council districts 1–7, Super Districts 8 and 9, and the 9 MPD precincts. Road classes come from the Memphis MPO's functional classification layer.
- **Budget and city facts:** the FY2027 adopted operating budget ($906M), the $3.39 property tax rate, 2% raises, the $96M reserve, MATA's $32M, xAI's ~$15M in property taxes, and the $13.6M Southwest Twin precinct. Also MPD's ~1,917 sworn officers against ~2,500 authorized, MSCS reading proficiency of 25.7% against ~45% statewide, and the council's structure and charter powers. Sources are listed in the in-game Guide.

## What's modeled

Council members are fictional (the seats and districts are real). The division-by-division budget split uses FY2025 shares scaled to FY2027. Revenue per cent of tax, how spending moves the city's indicators, and the vote and election formulas are game mechanics.

## Files

- `index.html` – the whole game (HTML, CSS, JavaScript)
- `data/base.json` – streets, roads, water, parks, rail, city limits, districts, precincts
- `data/buildings-main.json` – downtown and larger buildings, with heights
- `data/buildings-homes.json` – 250,970 homes and small buildings, loaded when you zoom in
- `data/pavement.json` – Pavement Condition Index for 1,738 segments of city-tracked highways and routes (City of Memphis GIS), used by the Street condition map mode

Map data is stored compactly: coordinates on a 2-meter grid, delta- and varint-encoded, then base64. `index.html` decodes it in the browser. The map engine is [MapLibre GL JS](https://maplibre.org/) 4.7.1, loaded from jsDelivr.

## Run it locally

The page loads its map data with `fetch`, so open it through a local web server rather than by double-clicking the file:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Turn on GitHub Pages

In this repository, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, and save. The game will be live at https://erndae.github.io/Bluff-city-mayor/ within a minute or two.
