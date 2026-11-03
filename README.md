# Bluff City Mayor

A city-management game set in Memphis, Tennessee. You play the mayor. You handle problems at real places on a real map of the city, write the city budget, win votes from the 13-member City Council, and run for re-election.

**Play it:** https://erndae.github.io/Bluff-city-mayor/ (once GitHub Pages is turned on, see below)

## v26.44: Face-to-face meetings and a chance to work it out

- Phone meetings now show the actual character at a furnished coffee shop, community room, or office, with larger faces, a location label, their role, and a reaction after each answer. Office audiences use the same furnished presentation.
- A declined request opens one final choice: explain the mutual benefit with Dealmaking, or safely respect their answer and repair the relationship. Recovery uses no extra action and can only award the original request once. A second refusal ends the conversation.
- Round labels and a final result card explain each choice and consequence. Meeting decisions hold the clock, and first-round relationship changes save immediately.
- Existing saves, meeting action costs, and contact cooldowns are preserved.
- Validation: five contact types, ordinary success, no-ask choices, safe repair, successful and unsuccessful recovery, duplicate-reward protection, and inline-script syntax.

## v26.43: Office visitors, wall pictures, and a rotating soundtrack

- Office visitors now have rounded faces, eyes, brows, noses, glasses, varied hair, lapels and hands. Their colors and accessories follow their character appearance.
- Framed skyline, garden, and community pictures decorate the office, reception, living room, bedroom, and kitchen without changing saved furniture layouts.
- Three new original instrumental tracks bring the soundtrack to eight songs. Scene playlists shuffle through their songs before repeating, with a Next song button. Victory still plays once, and hidden tabs pause music.
- Validation: room/collision and depth-rendering checks, rendered visual previews, and soundtrack lifecycle tests.

## v26.42: Approval isn't the vote

- In the year before your re-election, a **vote** badge replaces clout next to Approval, showing your share against your opponent if the election were today. Tap it for **Approval vs. the vote**: your chief of staff walks from approval to the vote, worst drag first (your record, opponent's ads, who shows up to vote, organizers, offices, endorsements, your opponent's base), with what to do about each. It notes that Memphis elects its mayor by plurality, with no runoff.
- If your vote trails approval by 3 points or more, your chief of staff flags it once a month.
- Your record now counts 40% less for a sitting mayor, since approval already reflects most of it. Candidates' records count fully.

## v26.41: Neighborhood stories, a second term, and your legacy

- **Neighborhood stories.** Five two-part storylines show up over your term, presented by that district's council member: Orange Mound losing its only grocery store, the Frayser youth league with nowhere to play, fixing Elvis Presley Boulevard in Whitehaven, rising rents and an 81-year-old facing eviction in Binghampton, and a closed school in South Memphis. Your first choice shapes the second chapter, and the ending goes on your record for the next campaign.
- **A second term.** Winning re-election brings a new 100-day agenda, a charter-amendment storyline (line-item budget power, an independent police oversight board, or city-county consolidation) that ends in a referendum decided by your approval and Star Power, and, two years in, lame-duck pressure as council members start running to replace you. Passing budget power gives you an extra action every month.
- **Your legacy.** When your time in office ends, "See your legacy" names what kind of mayor you were (the Builder, the Dealmaker, the Guardian, the Steward, the Steady Hand, the Neighborhood Mayor, the Promise Keeper or the People's Mayor) and shows how Memphis changed, your promises and big moments, which groups you won and lost, your closest allies and toughest critics, and how every title scored. People → "Your legacy so far" shows it any time.

- **Playtest bug fixes.** Your home screen showed "District ?" and the neighborhood bonus for finished projects stopped working (a new function had the same name as an old one); fixed. "Decide before it expires" for a Memphis event no longer sends you to an empty office. Going to a festival no longer pops a receipt over the conversation. The property-tax table fits on small phones.

## v26.40: Meetings are conversations, and the money is in plain sight

- **Meetings.** Every phone meeting is two rounds. First, how you answer their opening: listen (Education), make a public promise (Star Power), offer a trade (Dealmaking), or show you know the issue (the skill that matches the topic). Then what you ask for, which depends on who it is: a council vote, pressure (Inside Game) or a joint press conference; budget savings or the inside story from a department head; a joint project or fairer sales tax with a suburban mayor; public backing or money from FedEx, the Chamber or the County; turnout from community groups. Every option shows its odds, and a safe "no ask" is always there. A summary shows what worked.
- **What the property tax costs people.** The Budget office shows the yearly tax on a typical home in each district. Moving the tax slider shows the change per district, what renters pay per month, and what the city gains or loses (in officers or miles of paving).
- **Where the money went.** A monthly report (Budget hub, and a notification at each month's end) shows money in by source, money out by department, programs, bonds and upkeep, your decisions that spent reserve money, and what changed in city services. Flip back through past months.

- **Full-term playtest fixes.** A sitting mayor at 53–55% approval was losing re-election by double digits, so incumbents now get a small edge instead of a penalty (and the rival's core groups count a little less against you). The opponent's comebacks are 40% softer, the "courting a group" comeback only starts in the final eight months, and the counter-endorsement comeback no longer repeats on the same group. A low Star Power no longer slows name recognition (a high one still speeds it up). The bar charts in the money report now show.

## v26.39: See the money and who it affects

- Every decision card has a **"$ See the money and who it affects"** button. For each option it shows:
  - **The money:** one-time cost from the reserve (as a share of the reserve and per Memphian), yearly program costs, revenue gained or lost, other funding sources named in the deal (e.g. tourism tax revenue), and whether the council has to approve it.
  - **What changes in the city:** each service measure before and after (jobs climate, crime, streets, blight, transit, officers) and public mood.
  - **How residents would feel:** each group's share of voters, roughly how many people that is, what they care about most, and their long-run change in support, worked out by simulating the choice on a copy of the city.
  - **The council:** who would like it and who would resent it, by how much.
- "Needs attention" on the Take action screen now lists exactly which stations, hospitals or schools have a problem, what the problem is, and opens each one when tapped.

## v26.38: Memphis events are free, and you talk your way through them

- Going to a Memphis event no longer uses an action. "Go and mingle" opens a two-part conversation: someone at the event (a pastor at MLK Day, a pitmaster at the barbecue contest, a nurse at the St. Jude Marathon) greets you, then a reporter asks about the issue that crowd cares about most.
- Every answer is tied to a skill and shows your odds: Star Power (fire up the crowd, a quotable line), Dealmaking (handshakes, sharing credit), Education (listening, explaining your plan), Inside Game (staying on message), and Safe Streets or Money Smarts depending on the event. Pick the approach that fits your strengths.
- A "How it went" card shows each answer, whether it worked and how much support you gained with the groups who were there. Two wins bring confetti and good press.

## v26.37: Free activities are short conversations, and next steps go straight to the thing

- **Skill conversations.** Each free activity (speech coach, old dealmaker, City Hall insiders, the CFO, a professor, a police ride-along, donor calls) is a two-question conversation with a mentor. Pick how you'd answer; better answers teach you more (6 to 22 XP) and, for donor calls, raise more money. The clock pauses while you talk.
- **What you learned.** A card at the end shows the skill, the XP you earned, a progress bar to the next level, and a level-up (with confetti) when it happens. If Inside Game levels up it also tells you your new actions per month.
- **Next steps go to the exact place.** "Start a project" opens the project planner; "Raise money", "Run a poll", "Put ads on the air" and endorsements open that tab of Campaign HQ; door-knocking opens the doors section; "actions left" opens your available actions. Getting-started steps now open the phone's Council tab, the town hall section and the project planner directly.

## v26.36: A team that grows, a game that celebrates, and a phone pass

- **Your team levels up.** Your chief of staff and campaign manager go from New to Seasoned, Veteran, Ace and Legend. They earn experience every month and more when you follow their advice. A higher-level manager makes their specialty work better; a higher-level chief of staff makes you learn faster, and at Ace gives you an extra action every month.
- **Morale and poaching.** Ignore their advice and morale drops. A seasoned manager or chief of staff with low morale may get a job offer: match it, talk them into staying (Dealmaking odds), or let them go and start over. A free monthly check-in lifts morale. See it all in People → Your team.
- **Sound and celebration.** Confetti and a fanfare when you win the election, a debate or a crisis; an alarm and red flash when a crisis hits; a skill-up badge with a chime; crowd cheers and boos at festivals; your approval number pulses green or red when it moves. Motion is skipped for players who turn on reduced motion.
- **Phone pass.** Every screen was checked at 360 and 390 pixels wide. The budget table no longer hides its numbers off the side of the screen, and the laptop no longer scrolls sideways.

## v26.35: Your first 100 days, and crises that test you

- **First 100 days.** When you take office, pick 3 of 8 goals: sit down with the council, a listening tour, clear the backlog, fix the streets, a safer spring, know your team, fight for Memphis (use clout), keep the books balanced. A tracker on your desk and in the City hub counts the days and your progress, and "This week" pushes the next goal (harder after day 70). Each kept goal raises approval and makes the news; each missed one costs you. Keep all three for a bonus with every group. A day-100 report sums it up.
- **Crises.** About once or twice a term, something big happens: an ice storm and MLGW outages, a citywide boil-water notice, a viral police video, tornadoes in Hickory Hill, a deadly heat wave, or the I-40 bridge closing. The clock stops until you choose how to lead. Each choice shows which skill it uses and your odds, plus who it will win over (and who it may anger). Letting the departments handle it is safe but costs approval. A week later you hear the verdict, and the outcome goes on your record for the next campaign.

## v26.33: Actions come from your Inside Game, and every skill has a job

- **Actions per month = 4 + Inside Game bonus** (v26.34 raised the base from 3 to 4): +1 at Inside Game 8, +2 at 12, +3 at 16 (up to 7 a month). Leveling up mid-month gives you the extra action right away. Character creation shows how many actions your build gets.
- **Each skill has a clear benefit:** Dealmaking (one-on-one persuasion, meetings), Money Smarts (fundraisers and donor calls raise more, city revenue), Inside Game (more actions, pressure, memos), Safe Streets (crime), Education (every skill grows 4% faster per point above 8, school results), Star Power (speeches, festivals, debates, faster name recognition, votes).

## v26.32: A first-month checklist, Memphis events, and an opponent who fights back

- **Getting started checklist.** A new, visible checklist walks candidates through the first month: platform, campaign manager, start the clock, knock doors, call donors, speak out, meet leaders, fundraiser, poll, first ad, endorsement. It shows as a chip under "This week" on phones, a card in the City hub and on your desk, and a full list with "Show me" buttons. Hide it any time; bring it back from the Guide.
- **Memphis on the calendar.** MLK Day, the April 4 remembrance, Africa in April, Beale Street Music Festival, the World Championship Barbecue Cooking Contest, Juneteenth, Elvis Week, Cooper-Young Festival, the Grizzlies home opener, the St. Jude Memphis Marathon and the Liberty Bowl. Each shows up a few days ahead: work the crowd, speak from the stage (Star Power odds), pay for extra police and cleanup (mayor) or set up a campaign booth (candidate), or skip it. Big crowds can turn into trouble if the mayor skips the prep. The next one shows in "Next on the calendar."
- **An opponent with a personality.** Your opponent is a Brawler, a Policy wonk or a Showman (shown in Campaign HQ). They react: attack ads when you pull ahead, spin after you win a debate, courting a group that's warming to you, answering your attack ads, chasing a counter-endorsement. Each reaction tells you what it cost and lets you answer: hit back at a press conference (Star Power odds), answer with an ad, or stay above it.

## v26.31: How you're doing, trend charts, and visitors who remember

- **Quarterly report.** At the end of every March, June, September and December a report opens with your headline number (vote share during a race, approval otherwise) and how it moved in three months, a chart of your trend, which groups warmed to you or cooled, your strongest and weakest district, which of your moves actually changed the numbers, your money, and one suggestion from your campaign manager or chief of staff with a "Do that next" button. You can open it any time from City → How you're doing.
- **Trend chart in Campaign HQ.** The Overview tab shows your favorable (or approval) and your head-to-head vote month by month, with a dashed line at 50%.
- **Visitors who remember.** When a council member's opinion of you swings hard (you granted or refused a request, took sides in a feud, threatened them), they remember it. A few months later they show up in your office: to return the favor (call in a vote, talk you up in their district) or with a grudge you can settle by apologizing, charming them, or reminding them who runs City Hall. Persuasion odds use your skills.

## v26.30: Something to do when you're out of actions, and a clock that keeps moving

- **Free things to do.** Call donors (weekly, raises money based on Money Smarts), and build any skill every two weeks: practice speaking, learn from an old dealmaker, coffee with insiders, go through the numbers, study the issues, ride along with police. They show up when you're out of actions, on the Available actions screen, in Campaign HQ's Money tab, and in a new "While you wait" screen.
- **Grayed out means unavailable.** Buttons you can't use right now are faded and dashed.
- **Time keeps moving in menus.** Screens, the phone and the laptop no longer stop the clock. Debates, votes, Election Day and pop-up decisions still do. New problems arrive as notifications instead of pausing (the old behavior is still in Map layers).
- **Advice you can act on.** With no actions left, your campaign manager and "This week" only suggest things you can actually do. "We're down to $X" points to free donor calls.
- **Candidates and the council.** As a candidate the council is view only, and council members no longer bring you requests, memos or feuds.
- **Campaign cash on campaign screens.** A bar at the top of Campaign HQ and the campaign trail shows your cash, actions left and head-to-head vote.
- **Ads say what they did.** Each ad button shows its expected gain, and after buying you see the change in your vote share.
- **Debates you can return to.** Leave mid-debate and you get a notification, a "Return to Debate" button in HQ and a top "This week" priority.
- Fixed side-scrolling on the character screen and the ad list on phones, and removed "Press Space" from the oath screen.

## v26.29: Candidates see the number that decides the race

- A long candidate playtest ended with "Your support 54%" in the top bar and a loss on Election Day. That number was how many voters like you, not your share of the vote.
- The top bar now says **Favorable** and shows a small **vote 48–52** badge beside it: your share against the mayor if the election were today. It turns green above 50.
- The monthly summary leads with the head-to-head number, and the tour explains the difference.

## v26.28: Persuasion runs on your skills, and long-playtest fixes

- Persuading people now depends on your skill. Each way of persuading uses a different one: Dealmaking for coffee and lunch, Star Power for public appeals, Inside Game for pressure behind closed doors. Every choice shows your skill and your chance of success before you pick it.
- The other person matters too. How much they like you, whether they're stubborn, and their personality (pragmatic, outgoing, reformer) push the odds up or down. Odds stay between 10% and 92%.
- New ways to persuade: a public call for unity or private pressure in feuds, winning over a member of a voting pact, and lunch or rallying their district when poaching a vote.
- A long mayor playtest showed mayors who never campaign lose even at about 60% approval. Your chief of staff now pushes you to hire a campaign manager in the last 8 months, the manager gives campaign advice once you're within 6 months, and "Put your campaign on the air" comes up in the final 3 months when you have money and no ads running. With ads, the test mayor won a second term.
- The challenger's built-in edge is smaller (7 → 4 points).
- Fixed an error when an outdated event was answered, and a council request that could be granted twice while its vote was pending.

## v26.27: A real desk, furniture that faces the right way, and office hours

**Furniture.** The mayor's office has an executive desk (wood pedestals, a modesty panel, laptop, papers, a brass nameplate and a desk lamp) with an office chair behind it facing the room, two guest armchairs facing the desk, a conference table with four office chairs, the TV and bookcase on the wall facing in, and a sofa in reception. At home, the writing desk gets an office chair, and the sofa and TV now face each other (they were turned toward the walls). The bookcase faces the room. Existing saves are fixed once. Two new furniture items are in the shop: Executive desk and Office chair.

**Office hours.** People who want something from you (council requests and favors, cabinet asks, feuds, pacts and other decisions at City Hall) wait in your office, standing in the room. Tap **Receive visitors (N)** to see who's waiting: portrait, role and what they want. **Receive** someone to hear them out and decide; then the next visitor is up. City Hall's "Go up to your office" button and City → Your office show how many are waiting, and expiring decisions from visitors take you to the office.

## v26.26: Your office, and meetings you travel to

**Your office.** As mayor, tap City Hall and choose **Go up to your office**, or use City → Your office. You walk in first person from the reception area into the mayor's office on the 7th floor: carpet, wood paneling, a big window over Downtown and the river, the city seal and flags. Your desk has the laptop, the TV plays the evening news, the bookcase builds skills, and the meeting table opens your phone to call people in. City time pauses inside.

**Meetings take you there.** Tapping Meet closes the phone, flies the map camera to the place (a coffee shop in a council member's district, FedEx headquarters, a suburb's city hall), moves your marker there, and starts a conversation. They speak first about what they care about, and you choose a reply: listen (safe, small boost), make a commitment (bigger boost; follow through), or ask for help (Dealmaking decides it: success means they owe you, failure cools them). Then they answer and you see the result.

## v26.25: Candidates only see what they can do

Mayor-only buttons (budget, orders, funding, council votes and the like) are now hidden from candidates instead of grayed out. A section left with nothing a candidate can use is hidden too. Once you win, everything appears.

## v26.24: Playtest fixes

Found by playing a full candidate race (March to Election Day, won) and nine months as mayor on a phone screen:
- "Play as the winner" after losing as a candidate crashed the game every day; fixed.
- "Answer: candidate forum" and "Decide before it expires" opened your desk, whose This-week card opened your desk again (a loop). Both now open the event itself. Expiring decisions no longer show the vague title "a decision".
- The major-donor dinner looked ready but did nothing when no donor network would back you. It's now grayed out with the reason (a community needs to be above 42% support).
- The manager no longer suggests ads or answering an attack when you can't afford an ad or have nothing on your record to run.
- In April, "Write and send your budget" now outranks routine decisions after mid-month, so you don't miss it.
- Result cards say "Your support", not "Approval", for candidates.

## v26.23: Action dots everywhere, and a manager who coaches you

Any screen whose header says how many actions you have left now shows the action dots there too, red when you're out. Your campaign manager sends a short tip a few times a month (days 4, 8, 11, 19, 23 and 27), in their own voice and led by their specialty. Dana (money) flags fundraisers and low cash. Marcus (field) points to your weakest district to knock and to organizers late in the race. Priya (media) wants fresh polls, speeches and ads at the right time. Rev. Booker (coalition) points to community groups and endorsements. Elena (debate) books debate prep and practice speeches. Tapping a tip goes straight to that section. Their specialty tip also leads their pop-up plan, and their tips replace the generic Monday note so you aren't double-notified.

## v26.22: Slower start speed and going straight to things

The slowest speed is now about 3 seconds per day (it was 1); the speeds run roughly 3 s, 1 s, ⅓ s, ⅛ s and 1/20 s per day. The money screen is called **Money**: your personal money and your campaign fund come first, and the city treasury is labeled "not your money." Tapping a row in **What you can do now** opens that exact thing: the right Campaign HQ tab, scrolled to that section, which flashes so you can see it. The same goes for your campaign manager's suggestions. When an action re-opens the same screen, you keep your place instead of jumping back to the top.

## v26.21: Everyday news, a real bookcase and Campaign HQ in tabs

**News.** The evening broadcast mixes stories that matter (your coverage, your approval or race, crime and population) with everyday Memphis news: the Grizzlies and Tigers, Memphis in May, Elvis Week, the St. Jude Marathon, the zoo, new restaurants, I-240 lane closures, a weather report and more, chosen by season. The News screen also has an "Around town" section, which doesn't move your numbers.

**Bookcase.** The starting bookcase faced the wall, so you saw its plain back. It now faces the room (existing saves are fixed once), and its shelves hold rows of books in varied colors and heights, with a few stacked flat.

**Campaign HQ.** It's split into tabs: Overview (manager, money totals, your opponent), Voters (doors, polls, groups and speeches), Money, Ads, Field (organizers and offices), Endorsements, Debates and Log. Your campaign manager's suggestions open the right tab.

## v26.20: Phone and laptop screens

Your phone and laptop have their own look. The phone opens in a phone frame (rounded body, a status bar with the game date, a home bar), both on the map and at home. At home, the laptop opens a laptop frame (screen bezel, camera dot, keyboard base) with a desktop of apps: inbox, news, Campaign HQ, budget, Power & influence, city numbers and your phone. Each app opens inside the laptop. Closing an app returns to the desktop, and closing the laptop or phone puts you back exactly where you were standing in the house. Meeting someone from your phone at home walks you out the door to the meeting. When you're out of actions, the phone says so at the top, and Meet buttons read "No actions" instead of looking clickable. Switching phone tabs no longer piles up back buttons.

## v26.19: The evening news and a bookcase

**TV.** "Watch the news" now plays a short Channel 6 evening broadcast right in your living room. The top story is your latest real coverage (green for good, red for bad), followed by your approval (or, as a candidate, the days left and your last poll) and the crime and population numbers. "Read all the coverage" opens the full News screen.

**Bookcase.** "Pick a book" offers seven books, each building a skill by 25 experience: budgets (Money Smarts), coalitions (Dealmaking), safer streets (Safe Streets), early reading (Education), public speaking (Star Power), City Hall (Inside Game) and Memphis history (Star Power). One book a month, and reading doesn't use an action.

## v26.18: Your phone, your laptop and meetings around town

**Phone.** A phone button sits beside the menu, and inside your home there's one in the header. Its contacts: power players (the Shelby County mayor, the MSCS superintendent, the Greater Memphis Chamber president, a FedEx executive, the pastors' coalition chair and the AFSCME Local 1733 president; all fictional people in real roles), the 13 council members, your cabinet, community leaders and the suburban mayors. **Meet** uses 1 action and takes you to them: a coffee shop in their district, their department, their city hall or their office. Your marker moves there. **Call** is free once a month per person and gives a small boost. Candidates see their campaign manager, donors and community leaders.

**Laptop.** The writing desk now holds a laptop. "Use your laptop" opens your inbox, the news, Campaign HQ, the city budget, Power & influence, the city's numbers, or your phone to schedule a meeting, without walking back to the map.

The extra arrow buttons inside the home are gone. Walk with the stick (or WASD) and drag to look.

## v26.17: A candidate's top bar

As a candidate, the top bar shows **Campaign cash** (green, yellow or red by how much you have, with monthly spending or total raised underneath) and **Election Day** (days left, turning yellow inside 90 days and red inside 30) instead of the city reserve and council count. Tapping either opens Campaign HQ. Once you win, the bar switches back to Reserve fund and Council.

## v26.16: Cleaner pop-ups and a clearer candidate start

The City, Budget, People and Campaign tabs now appear only on those hub screens (and Campaign HQ and your desk), not inside every pop-up. A screen opened from a hub still shows its back button. The candidate path explains its start: the title-screen card says you begin in March 2027, seven months before Election Day, and the tour's first step says the same. City powers stay grayed out until you win. Population news no longer fires while the game fast-forwards to the start of a campaign.

## v26.15: Actions you can see, and an easier start

Meetings and campaign stops are now just **actions**, everywhere. Under the date, a meter shows **ACTIONS ●●● 3 left · refill Nov 1**. It pulses and shows "−1 action" when you spend one, turns red at zero, and posts one plain note when you run out. Every button that costs an action carries a small amber marker. The tour is shorter (7 steps as mayor, 6 as a candidate) and matches today's screens: actions, time, approval, This week, the map, and the City, Budget, People and Campaign buttons. The Guide now opens with "New here? The game in five steps." On phones, keyboard hints like "(P)" are hidden, at most 2 notes stack at once, and repeat notes replace each other. Your advisor's Monday note now matches the This week card.

## v26.14: Your lane, more backgrounds, a steadier mayor

"Lifestyle focus" is now **Your lane**, and the skills have new names: Dealmaking, Money Smarts, Inside Game, Safe Streets, Education and Star Power. Character creation now has 16 backgrounds in their own section: the original five plus Nurse, Pastor, Union Electrician, Army Veteran, Firefighter, Tech Founder, Musician, Social Worker, High School Coach, Journalist and Real Estate Agent. Each adds skills, a starting boost with the voter groups who relate to it, and reactions from council members. Candidates also have 19 jobs to choose from (new: firefighter, musician, social worker, coach, journalist, real estate agent, attorney, barbershop owner, FedEx hub worker and Army veteran). The mayor's marker now stays where you last did something. It no longer shuttles between City Hall and home on its own.

## v26.12: A living city and its population

**Menu.** The ☰ button beside the Bluff City Mayor logo (or Esc) opens a menu: back to the game, save, save and load, guide, music, and save and quit to the title screen.

**Park names.** The 234 city parks and two state parks are labeled with their names from the City of Memphis GIS layer. Big parks show from further out, small ones as you zoom in.

**Yards (off by default; Map layers → Yards around houses).** Every house gets a lawn around its footprint, a driveway on one side and a hedge line at the lot edge from street level. Lot shapes are stylized, not property lines.

**Traffic (off by default; Map layers → Traffic on the streets).** Cars move along the real street network at street level (zoom 14.5+), more of them on major roads, faster on interstates, with occasional MATA buses. They follow connected streets and drive on the right. Traffic stops when the Buildings layer is off, in other map modes, indoors, in a hidden tab or with reduced motion.

**Population.** Memphis starts at about 605,200 (the Census Bureau's July 2025 estimate of 609,647, carried forward at the recent rate of about −0.6% a year). Each month it changes with jobs, crime, blight, schools, streets, transit, health and the tax rate. See it under City indicators or People → Population, with a monthly chart and the reasons people are coming or going. Every 1% change moves city revenue by about $6 million a year, and crossing a 5,000 mark makes news.

## v26.11: Stable home rendering

Home surfaces now use a depth buffer rather than sorting entire faces by average distance. Walls and furniture stay correctly in front of or behind each other as the camera turns, including close to doorways and overlapping surfaces. A continuous ceiling and floor base close the room. The room geometry stays fixed; looking around changes only the camera. Furniture previews are solid and depth-tested, so they do not show through walls.

WebGL provides hardware rendering with antialiasing on supported devices; a per-pixel software depth renderer handles browsers without it. Both use the same geometry and camera projection. Existing layouts, furniture purchases and controls are retained. `node tools/check-home-renderer.cjs` checks crossing surfaces, 600 independent ray/triangle visibility samples over six camera views, repeatability, unchanged furniture, GPU depth state, buffer reuse and cleanup. Browser review exercises turning using the software fallback; hardware WebGL is unavailable in that review environment.

## v26.10: A first-person home

Tap your house marker, choose **People → Your home**, or use **Go inside your home** in Household. Walk through a furnished living room, kitchen and bedroom at eye level. Drag to look, use the touch stick or step buttons to walk; on a keyboard use WASD and the arrow keys. City time pauses indoors and returns to its previous pause state on exit.

Furnish & decorate offers 12 furniture types with a preview, quarter-turn rotation and an explicit Buy & place price. Purchases debit only personal cash and appear in personal purchases; moving and storing owned items is free. Walls, fixtures, other solid furniture and doorways constrain placement. Choose wall colors and floor finishes for free. Layouts and stored furniture save with the current game slot and stay with you when you move homes. Existing games receive a starter layout on first entry, without a charge. The older household furniture upgrade retains its existing donor-dinner effect; decorative purchases do not alter campaign balance.

The TV opens News and the desk opens Campaign HQ when nearby. Resting is a quiet moment with city time paused, without a new resource or stat system. This is a stylized shared floor plan rather than a measured recreation of an individual property. The home uses a self-contained Canvas renderer, so it works without WebGL or additional network assets.

Validation: `node tools/check-home.cjs`, `node tools/check-flow.cjs`, and `node tools/check-building-links.cjs`. Browser review covers the first-person view, desktop and 390×844 phone controls, a purchase and a saved layout; the city map's WebGL rendering remains unavailable in the review browser.

## v26.6: Living houses and buildings

Homes keep their pitched roofs and varied exterior colors. Larger unnamed buildings now have eight exterior color choices, flat roof surfaces with raised edges, window rows and glazed entrances. Real footprint boundaries and measured building heights are retained; named landmarks retain their existing designs and visit links. Decorative architecture remains stylized.

At close zoom, window lights slowly brighten and dim in different groups across homes, commercial buildings and named public buildings. Ambient movement stops when the game is paused, the Buildings layer is off, the tab is hidden or reduced motion is requested. It has no effect on game time, money, votes or saves. Roof meshes use the existing viewport grid and work batches; animation changes shader time rather than rebuilding geometry.

Validation: `node tools/check-houses.cjs` and `node tools/check-building-links.cjs` cover geometry, renderer lifecycle, lighting pause/resume and reduced-motion rules, named-window paint updates, and all 90 destination links. The automated browser has WebGL disabled; geometry is reviewed separately with a software projection.

## v26.3: A clearer next move

The main controls and menu tabs now have four destinations: **City, Budget, People, and Campaign**. City contains the weekly focus, full desk, available actions, decision history, and expandable reports/settings. Budget keeps city and personal finances together; People groups residents, council, cabinet, your character and neighboring mayors. Keyboard shortcuts, campaign-manager strategy and the full Campaign HQ remain available.

Your chief of staff or campaign manager recommends one weekly priority, with two alternatives tucked below. A relevant focus persists through the week and saved-game reloads; an urgent deadline, completed/unavailable task, new week or role change updates it. Taking the next step opens the relevant existing action without spending resources automatically.

Action reports lead with up to three measured changes, a reaction and the next recommended step. All figures and reactions remain expandable. Campaign actions now report campaign cash, name recognition, polls, staffing and recurring payroll separately from city reserves. Existing decisions and saved games remain compatible.

Checks: `node tools/check-flow.cjs` verifies priority persistence and rollover, urgent overrides, role changes and measured city/campaign receipts. Browser checks exercise navigation and action receipts; the preview environment cannot render the WebGL map.

## v25.6: Houses with roofs and color

Neighborhood homes now have pitched roofs, contrasting roof colors, and ten exterior colors. Closer zoom adds doors, window frames, and one- or two-story facades. This covers both central Memphis and the surrounding residential footprint layer. Named landmarks and civic facilities retain their own designs.

Roofs appear at neighborhood zoom (15+); doors and windows appear at 16+. The Buildings layer switch controls them. Geometry follows existing footprints, with stylized architecture rather than a survey of individual homes. Nearby roof meshes are built in small batches and capped at 8,000 homes to limit memory and interaction delays. Existing saves remain compatible.

Validation: `node tools/check-houses.cjs` checks convex and concave roof coverage, deterministic colors, real city footprints, renderer lifecycle, and inline script syntax. `node tools/check-building-links.cjs` verifies all 90 named destinations. The automated browser environment cannot initialize WebGL; geometry was visually reviewed with a software projection, while full map rendering still requires a WebGL-capable browser.

## v22: A city that responds

Projects show crews, paused work, finished improvements, and wear when satisfaction falls. Completed roads get fresh pavement markings; rehab projects recolor small sets of nearby real footprints as simulated homes. Those selections do not identify real vacant properties.

Police and fire stations now track building condition separately from service readiness, with repairs, monthly wear, and location decision history. Landmarks show active funding and waiting decisions. Council and cabinet profiles offer personality-based dialogue and priorities.

Event choices, civic actions, project proposals, construction pauses, and upkeep decisions produce reports of measured changes, reactions, and follow-up commitments. Open **Decisions** to revisit the latest 40 reports. This history is included in existing saves. Conversations are free advice and do not create promises.

Validation: `tools/check-city.cjs` and `tools/check-life.cjs` exercise the game using Playwright with Microsoft Edge and a local server on port 8765.

## How to play

| Control | What it does |
|---|---|
| WASD / arrow keys | Pan the map (hold Shift to go faster) |
| Mouse at screen edge | Scroll the map (can be turned off under Layers) |
| Scroll wheel | Zoom toward the cursor. Zoom out for the political map of council districts; zoom in and the city tilts into 3D |
| Click | Open a landmark, an amber issue pin, a council district or a police precinct |
| 1–7 | Map modes: City, Political, Council opinion, Street condition, MPD precincts, Region, Public opinion |
| Space | Pause / resume time |
| + / − | Change speed (1–5) |
| N | Skip to the end of the month |
| E / O / I / K / M | Mayor's actions / Public opinion / Mayor's Desk / Campaign HQ / Money |
| B / C / V / L / H | Budget office / Council chamber / Whip count / Map layers / Guide |
| Backspace / Esc | Back to the previous menu / close it. Every menu also has tabs along the top |

**Your mayor is a character.** Start by naming your mayor and choosing their look, up to 3 traits (at most one background, such as Former Police Officer or Community Organizer) and 22 skill points across six skills: Diplomacy, Stewardship, Intrigue, Public Safety, Learning and Charisma. No skill can start above 14. Skills shape council opinion, revenue, crime, school results, approval and how often your hooks leak. Click your portrait at the top left to see them.

**The council are characters.** Each of the 13 members has a portrait, traits (Ambitious, Loyal, Frugal, Reformer, Ward Boss, Vengeful, Gregarious, Pragmatic, Stubborn), a home district and an opinion of you from −100 to +100. Click a member to see every reason behind that number. Reasons fade over time. You get 3 private meetings a month, and you can fund a $1M project in a member's district every 6 months, though Frugal members resent the pork.

**Favors and hooks.** Members owe you favors when you grant their requests (blue pins in their home districts, often naming real poorly rated roads from the city's pavement data), fund their district projects, or quietly protect them. Your inspector general's confidential memos can give you a hook on a member. Before a vote, open the whip count (V) to see who's with you, who's leaning and who's against. You can call in a favor or use a hook to lock a vote. Hooks have a 30% chance to leak.

**Neighboring cities.** Bartlett, Germantown, Collierville, Arlington, Lakeland and Millington are separate cities with their own governments, outlined on the map at their official boundaries. You can meet them, co-host events, and handle shared issues: fire and EMS mutual aid, annexation reserves, the three Germantown schools still run by MSCS, a backup water connection, a bus line to Wolfchase, a corporate headquarters fight with Collierville, sewer capacity for Arlington, a retail site in Lakeland, and the Navy base in Millington. Good relations lift the regional economy. Bad relations can send the suburban mayors to Nashville against you.

**Take action yourself.** Press E for the Mayor's actions. Propose ordinances to the council (such as fast-tracking data center permits like xAI's, or requiring air monitoring near them), sign executive orders, hold town halls in a district, meet with community leaders, hold press conferences, and rally supporters in an election year. Before you send an ordinance you get a projected vote, member by member.

**Population groups and public opinion.** Memphis is split into eight groups: working families, homeowners and seniors, renters and bus riders, MSCS parents, the church community, young professionals, the business community, and city workers and unions. Each has a size, turnout, home districts, concerns and its own approval of you. Your approval is their turnout-weighted average, and each council district's approval comes from the groups that live there. Press O to see every group and why it feels the way it does, or use map mode 7 to see approval by district and suburb, or where each group lives.

**Politicians want to stay in office, but don't always follow their voters.** Council members and suburban mayors react to how their own voters see you, more strongly in the year before their election. Bartlett, Germantown and Lakeland elect mayors in November 2026, and a suburban mayor can lose for being too friendly with Memphis. Each politician also has backers (business, unions, congregations and so on) and listens to their voters closely, mostly, somewhat or rarely. So some vote against what their district wants, the way many officials backed xAI's South Memphis site over neighbors' objections. Term-limited members barely care about their voters at all.

**Projects and consequences (v10).** From Actions, start a capital project: repave a real poorly rated road from the city's pavement survey, rehab vacant homes in a neighborhood, or renovate a neighborhood park. Each goes to a council vote, out to bid, then takes months to build, with progress, monthly payments from reserves (or bond debt service), delays you must handle (rain, high bids, unmapped MLGW lines, short-handed contractors) and local reactions. Projects stay on the map; finished roads turn green in the street-condition mode.

**Stories that follow your decisions.** Backing a data center deal, ordering hot-spot patrols, or finishing a home rehab starts a chain of events months long, with different endings depending on your choices. Endings and finished projects go on your public record, and your opponent uses that record in the election.

**The Mayor's Desk** (press I) puts urgent decisions, council votes, projects and developing stories in one place. Click an item to go straight to it, and choose which kinds of news pause the clock.

**Promises and political deals (v11).** When you take office you make three campaign promises (fix streets, bring homes back, no new taxes, better buses, more officers and so on), each with a measurable target and a September 2027 deadline, tracked on the Mayor's Desk. Council members who lean against you will name a price for their vote, such as "put my district's worst road on the repair list" or "cut the cost by a third." You can accept, counteroffer or refuse. Deals that promise future action get a deadline; members remember whether you kept them. One challenger runs against you on a consistent platform, championing particular communities and using your record of broken promises, broken deals and neglected projects. Finished projects need upkeep: cut it to save money and satisfaction falls, the benefits wear off, and it can become an attack ad. A one-year check records whether each project delivered. Your mayor can now pick sex, hairstyle, facial hair, clothing and colors, glasses, earrings and a lapel pin, and change their look later.

**The campaign (v12).** Three separate accounts: the city treasury, your campaign fund and your personal money. Campaign HQ (K) handles fundraising: grassroots fundraisers, and major-donor dinners where fictional PACs give big checks with expectations attached (cross them and they fund your opponent). It also covers ads that promote your record, defend it or attack your opponent, with diminishing returns and the most effect in the last three months, plus field organizers, district field offices, and citywide or district polling. Your opponent raises and spends by visible rules. Endorsements are decided July–September 2027, debates are September 9 and 23, and Election Day is Thursday, October 7, 2027 (Memphis votes on the first Thursday in October). The result comes from each population group's support and turnout, so money amplifies your record but can't replace it. Your salary ($170,817 a year, the last confirmed figure) pays into a personal account. You can buy optional wardrobe items that show on your portrait (basic looks stay free), or put up to $25,000 into your campaign.

**Clarity and balance (v13).** A skippable introduction explains the three accounts. The Money tab (M) shows them side by side, and every month closes with a one-line money summary: operating gap, construction, one-time decisions, campaign in and out, personal pay. Salary is shown as $14,234.75 a month gross and about $9,622 estimated take-home, with every deduction assumption listed (Tennessee has no state income tax on wages). Election results now separate support among all adults from support among actual voters, and list what each factor added or cost in points, including points per $100K for each kind of spending. Field offices pay off in close districts, organizers help most when your supporters are lower-turnout groups, and ads work best late with a record to run on. After a re-election win, campaign cash and donor relationships carry over, while staff, offices, polls, endorsements, debates and the personal-money cap reset. Phone layout: one scrolling action bar, a Desk button, and notices that stay clear of the stats.

**Polish (v14).** The Budget outlook shows a 12-month reserve forecast, why the reserve is falling (service costs grow faster than revenue, plus programs, raises, bonds, upkeep and construction), and ways to close the gap, each with its own forecast. You can pause cash-funded construction. The challenger now plays strategically: they court the communities most unhappy with you, aim ads at your broken commitments, and open field offices in close districts, all visible in Campaign HQ. Election results explain themselves in plain language, with exact numbers tucked into an optional analysis section. The PAUSED badge sits inside the clock and no longer overlaps anything on phones, even with larger text.

**The mayor's household (v15).** Your salary pays your own bills. Rent (1BR, 2BR, or a 3BR house) or buy (3.5%, 10% or 20% down) in 12 Memphis neighborhoods at real fall-2026 prices: RentCafe neighborhood rents, Redfin and Zillow home prices, and a 7.32% mortgage (Freddie Mac, Oct 22, 2026). Property tax is 25% of value × (city rate + Shelby County $2.69, then $2.702382 in 2027). The bills are MLGW electric, gas and water (2026 rate survey, seasonal), city sewer and solid waste fees (estimates), food (USDA plans), car insurance (NerdWallet Memphis average), gas (AAA Memphis $3.914), or MATA day passes. City policy moves them: the property tax rate, MLGW board appointments, MLGW's real proposed 12% residential increase (a decision for you), projects finished near your home, crime (car insurance), and landlord rules (rent). Leases renew at +2.5%, home values change every July, selling costs 6%, and an overdrawn account runs credit card interest. The charter requires the mayor to live in Memphis, so suburbs aren't offered. Every number shows its source or says it's an assumption.

**Police, fire and hospitals (v16).** MPD's nine stations, all 56 Memphis Fire stations and 11 major hospitals sit on the map at their real addresses (positions from the City of Memphis GIS fire station layer and address locator). Click one to visit, fund overtime patrols, equipment, repairs, smoke alarm drives, hospital violence intervention, health fairs or job training. Station morale and readiness drift down each month, problems pop up (a broken engine, a failed AC), and ignoring them costs you in that district. A gold marker shows where your mayor is: City Hall on weekdays, home on weekends, and wherever you go to act (F finds it). Faster scroll zoom, Q/Z keyboard zoom, faster panning that speeds up as you hold, and a shop with home upgrades (thermostat, solar, heat pump, security), cars (EV, hybrid, e-bike), memberships, season tickets and local giving that change your bills or how groups see you. All meta and comparison text was removed from inside the game.

**Characters (v18).** Hover any face or name (council members, suburban mayors, your cabinet, your own portrait) for a pop-up character card: opinion of you, traits, the top reasons behind the opinion, favors, hooks and whether they're running against you. Click for the full page. Events now come from a person: the cabinet member who runs that area, the local council member for neighborhood problems, or a suburban mayor. A new Cabinet tab has ten department heads with their own opinions; meet, praise or replace them. Unhappy ones leak to reporters and very unhappy ones quit. Keeps the v17 soundtrack.

**Living characters and balance (v19).** Council members start with allies and rivals. Allies vote as a bloc (commit one and their allies lean your way) and their opinion of you rubs off. New People events: feuds (take a side or broker a truce), voting pacts (court them, let it happen, or split them), your opponent courting a member, endorsement requests in election season, cabinet requests (academy class, ladder trucks, hiring freeze, pothole blitz and more) and scandals. An ambitious cabinet member schemes toward a run; uncaught, they quit and back your opponent. Unhappy cabinet members leak, and leaks, defended scandals and lost endorsements show up in your opponent's ads. Balance: overtime patrols and hospital violence programs have diminishing returns, civic spending keeps a $20M reserve floor, ignored station problems cost more, and the cabinet starts less loyal. In matched runs, ignoring People events costs about 1.7 points on Election Day and handling them well gains about 1.1.

**Notifications, sound and money colors (v20).** News arrives as cards in the lower right: new business, People events, month closings, station problems, money in and out. Click a card to go there; cards fade on their own. Synthesized sound effects for clicks, opening menus, new events, good and bad news, money, alerts, month closings and council votes (on/off and volume under Layers). Every amount with a sign is colored: +$ in green for money coming in, −$ in red for money going out, across actions, the shop, Campaign HQ, events and your household bills. Scroll zoom is about 3x the default speed; Q/Z keyboard zoom and the +/− buttons are faster too.

**Run for mayor, succession and fixes (v21).** A second way to start: **Run for mayor** in March 2027 as a Memphian with a day job (pastor, nurse, teacher, small business owner, union electrician, nonprofit director, retired police sergeant or software engineer). Pick three platform planks, knock doors by district, meet community leaders, speak out, raise money, run ads, answer candidate forums, reporters and attacks, debate, and take on the sitting mayor in October. Name recognition starts at about 22%. Win and you're sworn in January 1 with your platform as your promise list. The game now continues after a term: in a second term you endorse a successor (a council ally, a cabinet member or a newcomer); if they win you play on as the new mayor. After any loss you can play as the winner, skip ahead and run again, or start over. Re-election is harder: challengers get a built-in edge, so a mayor who governs well wins about 6 of 8 test elections at around 54% of the two-way vote. A Getting started checklist on the Mayor's Desk teaches one system at a time, with Show me buttons. Fixed: Change your look swatches did nothing in office; Rent and Buy on the Move screen were swallowed by the map-mode handler; the camera's tilt correction cancelled zoom animations, which made scrolling and the +/− buttons feel slow.

**Save slots and a 20-year stress test (v23, merged with the v22 city redesign).** Four save slots: the start screen lists them with Continue, Load and Delete, a new game picks the first empty slot (or asks which to replace), and in game G opens Save and load, where you can save now, keep a copy in another slot before a big decision, load another game, or go to the main menu. Old saves move into slot 1. A simulated 2026–2050 run across five mayors exposed and fixed: the public record never fading (it now halves about every 14 months and is capped near ±8 points), broken-station grievances stacking without limit (now one capped complaint per district, at most 6 broken at once, and departments fix them on their own after 6 months), jobs and reading running to their caps, streets decaying to zero, budgets that never refilled the reserve (automatic budgets now aim for 10% within three years, and a negative reserve costs interest and public trust), new mayors inheriting the old mayor's savings and home, and elections silently skipped when the first Thursday of October fell on the 1st.

**More variety in what happens (v24).** 31 new events: seasonal ones that return at their time of year (ice storms, boil-water notices, the river rising, tornadoes, Memphis in May, Elvis Week, heat waves, crossing guards at the start of school, full holiday shelters); ones that appear when the city is in a certain state (a violent weekend when crime is high, a 311 pothole flood when streets are poor, a credit-rating watch when the reserve is thin, a surplus fight when it's flush, MATA breakdowns, layoffs or an expansion, rising reading scores, vacant house fires, protests at low approval, officers leaving for the suburbs); and ones that only show up in later years (an electric city fleet, failing water mains, driverless trucks, the FedExForum lease, bridge repairs, a tech campus, aging fire engines, record heat on the grid). Ten neighborhood templates generate problems on real poorly rated streets and in real neighborhoods (sinkholes, dumping, dark streetlights, speeding, empty schools, flash flooding, neighbors' requests, grocery closures, loose dogs, abandoned cars). Council requests come in several versions per priority, ordinances return every 3 years instead of every 18 months, and other events every 2 years unless they're seasonal. In a simulated decade: about 240 distinct problems out of about 390, against roughly 20 that used to come back every year.

**Schools, legacy, phones and an app icon (v25).** 238 schools are on the map at their real locations: every public school in Memphis (MSCS, charters and the Achievement School District, from the federal 2023–24 school location file), 30 private schools and 9 colleges. The mayor doesn't run schools: Memphis-Shelby County Schools has an elected board and, since July 2026, a state-appointed oversight board over its budget and superintendent, and the County Commission funds it. So the game only gives you the city's real levers: read to a class, meet the principal and parents (and push the district on a broken building), bring a library and nonprofit tutoring program (it shows up in June reading scores), crossing guards and safe routes (MPD hires the crossing guards), offer the district repair money (it can say no, and then nothing is spent), summer internships, and college research partnerships. A broken boiler is the district's to fix; a missing crossing guard is the city's, and parents blame City Hall if it sits. A Layers checkbox turns them off. **The Mayors of Memphis** (Y) tracks every mayor from first day to last: how crime, streets, blight, reading, jobs, buses, the reserve and taxes changed, promises kept and broken, projects finished, elections, and a letter grade. On phones, press and hold any face to see its card, tabs scroll and show the active one, and overlapping map labels step aside for the more important one. The game has an app icon (the Pyramid and the bridge at sunset), a web app manifest so it can be added to a home screen, and a loading screen with progress and tips.

**Clout: influence beyond City Hall (v25.2).** A clout score sits next to your approval (click it or press P). It comes from your approval rating, a recent election win (the bigger the margin, the bigger the mandate, fading over two years), your first months in office and charisma. Spend it on the mayor's platform to move things you don't control: rally the public to pressure the council, push the school district on early reading or closed buildings, pack the County Commission for school funding, lobby Nashville for road money, press MLGW on rates, get big employers to hire Memphians or fund summer jobs, chase a federal transit grant, unite the suburban mayors, or ask hospitals for a neighborhood clinic. Each push uses a meeting, its odds rise with clout, some backfire when they fail, and clout comes back over a few months. A popular mayor with a fresh mandate can get a lot done; an unpopular one mostly gets polite letters.

**The council approves big spending (v25.3).** Spending $1M or more from the reserve outside the adopted budget now takes a council vote: station repairs, the costlier executive orders, money for a member's district, cabinet requests like an academy class or new ladder trucks, and event responses that cost that much. Every button shows the projected tally. Members vote on their opinion of you, what the money is for, whether it lands in their district, how thin the reserve is and your clout; frugal members lean no and bigger asks are harder. If it fails, nothing is spent and you can ask again in 3 months. In test runs a popular mayor sees about 8 of these votes a term and loses about 1. Balance with clout: using it sensibly is worth about 2 points on Election Day.

**Local news and the State of the City (v25.4).** Five fictional local outlets (a daily paper, an online newsroom, a TV station, a community paper and an alt-weekly) cover City Hall. Each month the biggest stories run: your decisions, council spending votes, pushes that work or fall flat, ribbon cuttings, town halls, crime and street trends, polls, and stations or schools left broken. Each outlet has its own readers and beat, so a TV crime story hits different people than a budget story in the daily paper. Coverage moves approval with those readers and adds to or subtracts from your clout. Hold a press conference to soften a rough month, or gamble on a sit-down interview (R opens the news). Every January you give the **State of the City** (T): pick three of eight priorities. Pushes toward them cost less clout and work more often, and the council is friendlier to spending on them. A year later you're judged on real goals (for example, raise street condition 6 points), with a scorecard in the press. Skipping the speech is a story too. The getting-started checklist now walks you through schools, clout, the news, a council spending vote and the speech.

**A tour, what to do next, and only the mayor governs (v25.5).** New games open with a short guided tour that spotlights the real controls: 9 steps for a mayor (time, approval and clout, the reserve, the council, the desk, the map, actions) and 8 for a candidate (you're not in office yet, your support, meeting voters, Campaign HQ). It can be skipped and replayed from the Guide. The desk now always shows **What to do next**, ranked from what matters most right now: a decision about to expire, the budget, the State of the City, a broken station, your weakest district, your promises, swing council members, ads as Election Day nears; for a candidate, your platform, forums, money, polls, endorsements and the districts where you're weakest. On phones it's a Next chip under the top bar. A candidate is an ordinary citizen: council meetings, district funding, whipping votes, the budget, the cabinet, executive orders, city programs, projects, town halls, county and suburban diplomacy, the mayor's platform and the State of the City are grayed out until you win.

**Campaign managers, health care and taxing the wealthy (v25.7).** A campaign starts by hiring a campaign manager. Pick from five fictional Memphians, each strong at something and weaker at something else: Dana Whitlock (finance: fundraisers +40%), Marcus Jefferson (field: door knocks +30%, organizers turn out 25% more), Priya Raman (media: ads +35%, the priciest), Rev. Charles Booker (coalitions: group meetings +40%, endorsement asks count double) and Elena Ortiz (debate: speeches and forums +60%). Their salary ($2K–$4K a month) comes out of campaign cash; three unpaid months and they quit. Your manager takes over the What to do next box ("Marcus Jefferson suggests"), pushes their kind of move to the top, and sends a note each month. Candidates must hire one before campaigning; a mayor is prompted in the last year before Election Day. **Health care:** a new Community health indicator. The city's levers are community health workers in every district, free MATA rides to appointments, cancelling residents' medical debt (an executive order), hospital health fairs and clinics, and a Healthy neighborhoods priority for the State of the City. **Taxing the wealthy:** Tennessee bans local income taxes, so the game uses what a Memphis mayor could actually try: tighter PILOT tax-break deals for big companies (about $3M a year more, business groups object, a small drag on jobs) and lobbying Nashville for a local tax on luxury sales (very hard). Two new promises and platform planks, Health care close to home and Make the wealthy pay their share, plus speeches on both for candidates.

**Campaign HQ cleanup and the debate mini-game (v26).** Campaign HQ is the one place for the campaign, with quick-jump buttons (Doors, Money, Polls, Ads, Organizers, Offices, Endorsements, Debates). Go door to door from HQ by district, as a candidate or as a mayor within a year of the election. Field organizers and offices are explained in plain words: how many organizers you have and what they cost, and for each district whether the race is close (an office helps a lot) or lopsided (it won't change much). Debates are a mini-game: four rounds with the moderator, choose an approach that fits the question (defend your record, pivot to your plan, hit back, tell a Memphis story, or close on one of your promises), then stop the delivery meter in the green. The room meter shows who's winning; winning moves undecided voters by up to about 2 points. Practice with your team (uses a meeting) to widen the green zone; the debate coach manager widens it more. Group icons are now drawn line icons instead of symbols that phones turned into color emoji. The tours are shorter: your chief of staff or campaign manager gives the next steps. Money reminders only appear when a fundraiser is actually available, and Monday notes don't repeat the same advice two weeks in a row.

**Power beyond City Hall (v26.7).** People → Power & influence covers three real ways a Memphis mayor builds power. *Boards:* the mayor appoints the MLGW board (5 commissioners), the MATA board (9) and 3 of 9 Airport Authority seats (since the state's July 2026 law), and the council confirms each pick. Nominate a loyal ally (harder to confirm), a consensus pick or an independent expert (improves the agency). A board majority lets you direct the agency once a year. *Council races:* all 13 seats are on the 2027 ballot. Endorse incumbents or challengers, one meeting each. Endorsements help where you're popular and hurt where you aren't, and winners you backed arrive owing you. *Nashville:* a 0–100 relationship with the legislature. Below 30, bills against Memphis are filed each January to March (state seats on the MLGW or MATA board, a cap on city taxes and fees). You have two months to get relations back to 35 to stop each one. Above 70, you can ask for seats back. The start screen is now just a short intro and two path cards.

**City indicators are color-coded:** green is good, yellow is neutral, red is bad. **The Pyramid** is drawn as a real 3D pyramid.

**Real-time clock.** Time runs day by day. Pause with Space and set the speed from 1 to 5. New business arrives on random days and pauses the game (you can turn that off). Budget season, the June budget vote and elections also pause the clock. Each month closes into the Ledger.

The fiscal year runs July–June. You write the next budget in April, the council votes in June (7 of 13 votes to pass), and the city election is in October 2027.

## What's real

- **Map:** everything comes from the City of Memphis's public GIS services (maps.memphistn.gov, gis.memphistn.gov), downloaded October 2026. That covers 53,186 street segments, 304,547 building footprints (with heights for larger buildings), city limits, the Mississippi River, creeks, parks, railroads, council districts 1–7, Super Districts 8 and 9, and the 9 MPD precincts. Road classes come from the Memphis MPO's functional classification layer.
- **Schools:** public school locations from the National Center for Education Statistics 2023–24 school location file and its private school file; colleges from the City of Memphis K-12 GIS layer.
- **Budget and city facts:** the FY2027 adopted operating budget ($906M), the $3.39 property tax rate, 2% raises, the $96M reserve, MATA's $32M, xAI's ~$15M in property taxes, and the $13.6M Southwest Twin precinct. Also MPD's ~1,917 sworn officers against ~2,500 authorized, MSCS reading proficiency of 25.7% against ~45% statewide, and the council's structure and charter powers. Sources are listed in the in-game Guide.

## What's modeled

Council members and suburban mayors are fictional (the seats, districts and election calendars are real). The population groups, their sizes, where they live and how they react are modeled from Memphis's general makeup, not polling. The division-by-division budget split uses FY2025 shares scaled to FY2027. Revenue per cent of tax, how spending moves the city's indicators, and the vote and election formulas are game mechanics.

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

## Soundtrack (v17)

Open **Music** in the bottom action bar or **Music & volume** on the title screen. Five instrumental soul/blues tracks follow the city, council and budget screens, Campaign HQ, debates, and election victories. The victory theme plays once, then returns to the main theme.

Music starts after your first interaction, defaults to 22% volume, and remembers your music settings separately from game saves. Tracks crossfade over two seconds where Web Audio is available. Hidden tabs pause playback. Music settings temporarily stop game time without changing your pause preference. Audio failure does not block gameplay.

Playback code is in `music.js`, settings styles in `music.css`, and the MP3 files and track listing in `assets/music/`. Music was AI-generated with Runway for this game. No third-party songs or artist recordings were supplied as references.

## City and character redesign (v18)

The city uses a daylight palette, warm masonry, varied neighborhood colors and decorative windows on linked civic buildings. These facades are stylized; the underlying outlines remain the municipal building footprints. Characters have larger cartoon heads and eyes, with expressions reflecting their opinion. Existing character appearance choices remain available, and the mayor's map marker shows their portrait.

Named buildings can be hovered, highlighted and clicked to open their existing location actions. Shared buildings offer a choice of destinations. Building links respect the buildings and public-services layer switches and leave political map interaction intact. The Pyramid retains its special stepped shape and is directly clickable.

`data/building-link-audit.json` records the links and unresolved sites. All 90 building-oriented locations are now linked, plus the Pyramid. Parks, neighborhoods, planned sites and other area destinations remain markers. The three sites missing from the 2011 municipal survey use reviewed supplemental outlines; no arbitrary nearby building is substituted.

Address corrections use the [City of Memphis address locator](https://gis.memphistn.gov/server/rest/services/Geocode/Locator_MemphisCityLimits/GeocodeServer). Parcel-based links use [City of Memphis tax parcels](https://gis.memphistn.gov/server/rest/services/Parcel/CERT_TAX_PARCELS/FeatureServer/0). Exact candidate responses and parcel boundaries are retained with the source URLs. Footprint containment confirms the spatial link, not a photorealistic reconstruction or a field survey.

Rebuild links and decorative facades with `node tools/build-places.cjs`. `tools/resolve-addresses.ps1` and `tools/resolve-parcels.ps1` refresh public-source candidates for review. Run the local server, then `node tools/check-city.cjs` with Playwright installed to check selection, layers and mobile layout and capture previews. No saved-game format changes are required.

## Building completion (v25.5)

xAI Colossus, Austin Peay Station (including its motorcycle workshop), and Fire Station 1 now have selectable building models and corrected map anchors. Hover, selection, visits, condition colors and building/public-service layer switches use the same geometry. The old mall and superseded Chelsea footprints are suppressed before the base layers render. Existing saves and the v25.4 gameplay changes are preserved.

`data/building-supplements.json` retains source links, geometry and review notes. xAI uses [OpenStreetMap way 1381264361](https://www.openstreetmap.org/way/1381264361), version 10, © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under ODbL. The two station sites use approximate roof outlines digitized from [Esri World Imagery](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer) (Esri, Vantor and contributors), checked against [the Austin Peay architect's project](https://otma.com/project/traffic-and-special-operations-station-austin-peay-police-station/) and [the Fire Museum's Station 1 record](https://firemuseum.com/firehouses/fire-station-no-1-235-chelsea-avenue-at-n-fourth-street/). These station outlines, decorative facades and game heights are approximate, not surveyed or photorealistic reconstructions.

Rebuild with `node tools/build-places.cjs`; verify geometry, anchors, replacement exclusions and interaction/layer contracts with `node tools/check-building-links.cjs`. Supplemental data is bundled locally; gameplay makes no GIS or OpenStreetMap requests.
