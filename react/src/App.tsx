import { useState, useEffect } from 'react'
import { useQuery} from '@tanstack/react-query';
import './App.css'
import type { abno } from '../../node/shared/types/types'
import { MdExpandLess, MdExpandMore } from "react-icons/md";

interface Filters  {
  riskLevel: string,
  hp: number,
  workDamage: string,
  hasQlipoth: boolean | null,
  resistance: string | null | number
}

function App() {
  const url = 'http://127.0.0.1:3000'
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const [text, setText] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    riskLevel: '',
    workDamage: '',
    hp: 12000,
    hasQlipoth: null,
    resistance: null,
  })

  const { data: abnos, isLoading, isError, error } = useQuery({
    queryKey: ['abnos'],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      return res.json();
    },
  });
  
  const riskLevel = [
    "Zayin",
    "Teth",
    "He",
    "Waw",
    "Aleph",
  ]

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  const toggleFilter = <K extends keyof Filters>(key: K, value: Filters[K])=> {
    if(filters[key] === value) {
      setFilters(prev => ({...prev, [key]: []}))
      return
    }
    setFilters(prev => ({ ...prev, [key]: value}))
  }

  const filteredData = abnos?.filter((a:abno) => {
    if (text && !a.name.toLowerCase().includes(text.toLowerCase()) && !a.code.toLowerCase().includes(text.toLowerCase())) {
      return false
    }

    if (filters.riskLevel !== null && filters.riskLevel.length > 0) {
      if (!filters.riskLevel.includes(a.tier)) return false
    }

    if (filters.workDamage !== null && filters.workDamage.length > 0) {
      if (!filters.workDamage.includes(a.workDamage)) return false
    }

    if(typeof a.hp === 'number' && (filters.hp < a.hp)){
      return false
    }

    return true
  })

  const workTypes = ["Red", "White", "Black", "Pale"]

  const handleInput = (text: string) => {
    setText(text)
  }

  return (
    <>
      {/* <p style={{color: '#fffea1', fontFamily: 'Norwester', fontWeight: 'bold', marginBottom: '16px'}}>LOBPEDIA</p> */}
      <div style={{marginBottom: '24px', display: 'flex', flexDirection: 'column'}}>
        <input
          className='search'
          placeholder='Search...' 
          value={text} 
          onChange={(e) => {handleInput(e.target.value)}}>
        </input>
        <div 
          className='filter'
          style={{display:'flex', flexDirection: 'column', maxWidth: visible ? '650px': '300px'}}
        >
            <button
              className='icon'
              style={{all:'unset', display: 'flex', justifyContent: 'space-between', padding: '12px', flex: 1}}
              onClick={() => setVisible(!visible)}
              >
            <span className='text' >Advanced filters</span>
              {visible ? <MdExpandLess color='#fffea1'/> : <MdExpandMore color='#fffea1'/>}
            </button>
          { visible  &&
            <div style={{ display:'flex', flexDirection: 'column', borderTop: '2px #fffea1 solid', gap: '16px', padding: '12px'}}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '12px'}}>
                <p className='text' style={{ alignSelf: 'flex-start', textAlign: 'left'}}>Risk Level: </p>
                {riskLevel.map(x => 
                  <button className={filters?.riskLevel === x ? 'btn btn-selected' : 'btn'} onClick={() => toggleFilter('riskLevel', x)}>
                    {x}
                  </button>
                )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                <p style={{color: '#fffea1'}}>Work Damage: </p>
                {workTypes.map(x=> 
                  <button className={filters?.workDamage === x  ? 'btn btn-selected' : 'btn'} onClick={() => toggleFilter('workDamage', x)}>
                    {x}
                  </button>
                )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', gap: '36px'}}>
                <p style={{color: '#fffea1'}}>HP : </p>
                <input type='range' min="0" max="12000" value={filters.hp} onChange={(e) => setFilters(prev => ({ ...prev, hp: Number(e.target.value) }))} className='custom-slider'/>
                <p>{filters.hp}</p>
              </div>

            </div>
          }
        </div>

      </div>
      <table>
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Portrait</th>
            <th scope="col">Name</th>
            <th scope="col">Risk Level</th>
            <th scope="col">HP</th>
            <th scope="col">Qliphoth Counter</th>
            <th scope="col">Damage Type</th>
            <th scope="col">Resistances</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((u : abno) => 
          <tr key={u.id}>
            <td>{u.code}</td>
            <td>
              <img 
                src={`${url}/image/${u.portrait}.webp`} 
                alt={u.portrait}   
                height={156}
              />
            </td>
            <td>{u.name}</td>
            <td>
              <img 
                src={`/assets/Risk_${u.tier}.webp`} 
                width={48} 
                onClick={() => toggleFilter("riskLevel", u.tier)} 
                tabIndex={0}
                onMouseEnter={() => setFocusedId(u.id)}
                onMouseLeave={() => setFocusedId(null)}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: focusedId === u.id ? 'scale(1.5)' : 'scale(1)',
                  position: 'relative',
                  zIndex: focusedId === u.id ? 10 : 1,
                  cursor: 'pointer',
                }}
              />
            </td>
            <td>{u.hp}</td>
            <td>
              <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                <img src={'/assets/32px-QliphothCounterIcon.png'}></img>
                {u.qlipoth > 0 ? u.qlipoth : 'X'}
              </div>
            </td>
            <td>
              <img src={`/assets/${u.workDamage}DamageTypeIcon.webp`} width={64} alt="" />
            </td>
            <td style={{padding:'12px'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
                {Object.entries((u.resistances)).map(([key, value]) => 
                  <div key={key} style={{display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>
                    <span>({typeof value === 'number' ? value.toFixed(1) : value})</span>
                    <img src={`/assets/${key}DamageTypeIcon.webp`} height={32} width={32}></img>
                  </div>
                )}
              </div>
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default App
