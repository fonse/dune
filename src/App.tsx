import { useRef, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'

type Category = 'Attack' | 'Defense' | 'Action' | 'Worthless'
type Card = { name: string; category: Category; subtype?: string }
type HandCard = Card & { handId: number }
type Faction = { name: string; color: string }

const cards: Card[] = [
  { name: 'Crysknife', category: 'Attack', subtype: 'Weapon - Kinetic' },
  { name: 'Maula Pistol', category: 'Attack', subtype: 'Weapon - Kinetic' },
  { name: 'Slip Tip', category: 'Attack', subtype: 'Weapon - Kinetic' },
  { name: 'Stunner', category: 'Attack', subtype: 'Weapon - Kinetic' },
  { name: 'Chaumas', category: 'Attack', subtype: 'Weapon - Poison' },
  { name: 'Chaumurky', category: 'Attack', subtype: 'Weapon - Poison' },
  { name: 'Elacca Drug', category: 'Attack', subtype: 'Weapon - Poison' },
  { name: 'Gom Jabbar', category: 'Attack', subtype: 'Weapon - Poison' },
  { name: 'Lasgun', category: 'Attack', subtype: 'Weapon - Special' },
  { name: 'Shield', category: 'Defense', subtype: 'Defense - Kinetic' },
  { name: 'Snooper', category: 'Defense', subtype: 'Defense - Poison' },
  { name: 'Cheap Hero', category: 'Action', subtype: 'Action - Leader' },
  { name: 'Family Atomics', category: 'Action' },
  { name: 'Harj', category: 'Action' },
  { name: 'Karama', category: 'Action' },
  { name: 'Solaris', category: 'Action' },
  { name: 'Tleilaxu Ghola', category: 'Action' },
  { name: 'Truthtrance', category: 'Action' },
  { name: 'Weather Control', category: 'Action' },
  { name: 'Baliset', category: 'Worthless' },
  { name: 'Jubba Clopak', category: 'Worthless' },
  { name: 'Kulon', category: 'Worthless' },
  { name: 'La, La, La', category: 'Worthless' },
  { name: 'Trip to Gamont', category: 'Worthless' },
]
const cardOrder = new Map(cards.map((card, index) => [card.name, index]))

const factions: Faction[] = [
  { name: 'Bene Gesserit', color: '#1e3d70' },
  { name: 'Emperor', color: '#8a1d16' },
  { name: 'Fremen', color: '#c98220' },
  { name: 'Harkonnen', color: '#28292a' },
  { name: 'Spacing Guild', color: '#cb4e1f' },
]
const categoryClass: Record<Category, string> = { Attack: 'attack', Defense: 'defense', Action: 'action', Worthless: 'worthless' }
const categories: Category[] = ['Attack', 'Defense', 'Action', 'Worthless']

type Hands = Record<string, HandCard[]>

function App() {
  const [hands, setHands] = useState<Hands>(() => Object.fromEntries(factions.map((faction) => [faction.name, []])))
  const nextHandId = useRef(0)
  const [auction, setAuction] = useState<Card | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')

  const auctionableCards = cards
  const visibleCards = auctionableCards.filter((card) => card.name.toLowerCase().includes(query.trim().toLowerCase()))
  const chooseAuction = (card: Card) => {
    setAuction(card)
    setPickerOpen(false)
    setQuery('')
  }

  const awardAuction = (factionName: string) => {
    if (!auction) return
    const awardedCard: HandCard = { ...auction, handId: nextHandId.current++ }
    setHands((current) => ({ ...current, [factionName]: [...current[factionName], awardedCard] }))
    setAuction(null)
  }

  const removeCard = (factionName: string, handId: number) => {
    setHands((current) => ({ ...current, [factionName]: current[factionName].filter((card) => card.handId !== handId) }))
  }

  return (
    <main className="app-shell">
      {auction ? (
        <section className="auction-banner" aria-live="polite">
          <div className="auction-card-info">
            <div><span className="auction-kicker">CURRENT AUCTION</span><div className="auction-name-line"><h2>{auction.name}</h2><span className={`hand-card-tag ${categoryClass[auction.category]}`}>{auction.subtype ?? auction.category}</span></div></div>
          </div>
          <button type="button" className="cancel-auction" onClick={() => setAuction(null)} aria-label="Cancel current auction">Cancel</button>
        </section>
      ) : (
        <button type="button" className="auction-cta" onClick={() => setPickerOpen(true)}><Plus size={17} /> Add card to auction</button>
      )}

      <section className="faction-grid" aria-label="Faction card hands">
        {factions.map((faction) => {
          const hand = [...hands[faction.name]].sort((left, right) => (cardOrder.get(left.name) ?? 0) - (cardOrder.get(right.name) ?? 0))
          return (
            <article key={faction.name} className="faction-panel" style={{ '--faction-color': faction.color } as React.CSSProperties}>
              <header className="faction-heading"><h2>{faction.name}</h2>{auction && <button type="button" className="add-to-hand" onClick={() => awardAuction(faction.name)} title={`Add ${auction.name} to ${faction.name}`}>Add to hand</button>}</header>
              <div className="hand-list">
                {hand.length ? hand.map((card) => <div className="hand-card" key={card.handId}>
                  <span className="hand-card-copy"><strong>{card.name}</strong><span className={`hand-card-tag ${categoryClass[card.category]}`}>{card.subtype ?? card.category}</span></span>
                  <button type="button" className="remove-card" onClick={() => removeCard(faction.name, card.handId)} aria-label={`Remove ${card.name} from ${faction.name}`} title="Remove from hand"><X size={16} /></button>
                </div>) : <p className="empty-hand">No known cards</p>}
              </div>
            </article>
          )
        })}
      </section>

      {pickerOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPickerOpen(false) }}>
        <section className="picker-modal" role="dialog" aria-modal="true" aria-labelledby="picker-title">
          <header className="picker-header"><h2 id="picker-title">Add card to auction</h2><button type="button" className="modal-close" onClick={() => setPickerOpen(false)} aria-label="Close card picker"><X size={18} /></button></header>
          <label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by name" /></label>
          <div className="picker-list">{visibleCards.length ? categories.map((item) => {
            const groupCards = visibleCards.filter((card) => card.category === item)
            if (!groupCards.length) return null
            return <section className="picker-group" key={item} aria-label={`${item} cards`}>
              <h3 className="picker-group-title">{item}</h3>
              {groupCards.map((card) => <button key={card.name} type="button" className={`picker-card ${categoryClass[card.category]}`} onClick={() => chooseAuction(card)}><span className="picker-card-copy"><strong>{card.name}</strong><small>{card.subtype ?? card.category}</small></span></button>)}
            </section>
          }) : <div className="no-results">No available cards match that search.</div>}</div>
        </section>
      </div>}
    </main>
  )
}

export default App
