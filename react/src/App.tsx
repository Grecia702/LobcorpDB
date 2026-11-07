import { useState } from 'react'
import { useQuery} from '@tanstack/react-query';
import './App.css'
import type { abno } from '../../node/shared/types/types'
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FilterButton } from './components/FilterButton';
import { SortButton } from './components/SortButton';

interface Filters  {
  tier: string,
  hp: number,
  workDamage: string,
  code: string,
  hasQlipoth: boolean | null,
  resistance: string | null | number
  orderBy: string | null
  sortDirection: 'ASC' | 'DESC' | null
}

function App() {
  const url = 'http://192.168.100.27:3000'
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const [text, setText] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    tier: '',
    workDamage: '',
    code: '',
    hp: 12000,
    hasQlipoth: null,
    resistance: null,
    orderBy: null,
    sortDirection: null
  })

  const { data: abnos, isLoading, isError, error } = useQuery({
    queryKey: ['abnos'],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      return res.json();
    },
  });
  
  const tier = ["Zayin","Teth","He", "Waw","Aleph",]
  const workTypes = ["Red", "White", "Black", "Pale"]
  const code = ["Original", "Fairy Tale", "Trauma", "Donator"]

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  const toggleFilter = <K extends keyof Filters>(key: K, value: Filters[K])=> {
    if(filters[key] === value) {
      setFilters(prev => ({...prev, [key]: ''}))
      return
    }
    setFilters(prev => ({ ...prev, [key]: value}))
  }

  const toggleSort = (orderBy: string)=> {
    if(filters.orderBy && filters.sortDirection === 'ASC') {
      setFilters(prev => ({...prev, orderBy : orderBy, sortDirection: 'DESC'}))
      return
    }
    if(filters.orderBy && filters.sortDirection === 'DESC') {
      setFilters(prev => ({...prev, orderBy: null, sortDirection: null}))
      return
    }
    setFilters(prev => ({ ...prev, orderBy : orderBy, sortDirection:  'ASC'}))
  }

  const filteredData = abnos?.filter((a:abno) => {
    if (text && !a.name.toLowerCase().includes(text.toLowerCase()) && !a.code.toLowerCase().includes(text.toLowerCase())) {
      return false
    }

    if (filters.tier !== null && filters.tier.length > 0) {
      if (!filters.tier.includes(a.tier)) return false
    }

    if (filters.workDamage !== null && filters.workDamage.length > 0) {
      if (!filters.workDamage.includes(a.workDamage)) return false
    }

    if (filters.code !== null && filters.code.length > 0) {
      if (filters.code[0] !== a.code[0]) return false
    }

    if(typeof a.hp === 'number' && (filters.hp < a.hp)){
      return false
    }
    return true
  }).sort((a: abno, b:abno) => {
    const key = filters.orderBy
    const order = filters.sortDirection

    if (!key || !order) return 0;

    const valA = a[key as keyof abno]
    const valB = b[key as keyof abno]

    if (typeof valA === 'string' && typeof valB === 'string') {
      return order === 'ASC' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'ASC' ? valA-valB : valB-valA
    }
  });


  const handleInput = (text: string) => {
    setText(text)
  }

  return (
    <>
      {/* <p style={{color: '#fffea1', fontFamily: 'Norwester', fontWeight: 'bold', marginBottom: '16px'}}>LOBPEDIA</p> */}
      <div style={{marginBottom: '24px', display: 'flex', flexDirection: 'column' }}>
        <input
          className='search'
          placeholder='Search...' 
          value={text} 
          onChange={(e) => {handleInput(e.target.value)}}>
        </input>
        <div 
          className='filter'
          style={{ maxWidth: visible ? '650px': '300px'}}
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
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap'}}>
                <p className='text' style={{ alignSelf: 'flex-start', textAlign: 'left'}}>Risk Level: </p>
                {tier.map(x => 
                  <FilterButton label={x} isSelected={filters?.tier === x} onClick={() => toggleFilter('tier', x)}/>
                )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap'}}>
                <p  style={{color: '#fffea1'}}>Work Damage: </p>
                {workTypes.map(x=> 
                  <FilterButton label={x} isSelected={filters?.workDamage === x} onClick={() => toggleFilter('workDamage', x)}/>
                )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap'}}>
                <p style={{color: '#fffea1'}}>Code: </p>
                {code.map(x=> 
                  <FilterButton label={x} isSelected={filters?.code === x} onClick={() => toggleFilter('code', x)}/>
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
            <th scope="col">Code button 
              <SortButton isSelected={filters.orderBy ==="code"} sortDirection={filters.sortDirection} onClick={() => toggleSort("code")}/>
            </th>
            <th scope="col">Portrait</th>
            <th scope="col">Name 
              <SortButton isSelected={filters.orderBy === "name"} sortDirection={filters.sortDirection} onClick={() => toggleSort("name")}/>
            </th>
            <th scope="col">Risk Level 
              <SortButton isSelected={filters.orderBy === "tier"} sortDirection={filters.sortDirection} onClick={() => toggleSort("tier")}/>
            </th>
            <th scope="col">HP 
              <SortButton isSelected={filters.orderBy === "hp"} sortDirection={filters.sortDirection} onClick={() => toggleSort("hp")}/>
            </th>
            <th scope="col">Qliphoth Counter 
              <SortButton isSelected={filters.orderBy === "qlipoth"}sortDirection={filters.sortDirection} onClick={() => toggleSort("qlipoth")}/>
            </th>
            <th scope="col">Damage Type 
              <SortButton isSelected={filters.orderBy === "workDamage"} sortDirection={filters.sortDirection} onClick={() => toggleSort("workDamage")}/>
            </th>
            <th scope="col">Resistances</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((u : abno) => 
          <tr key={u.id}>
            <td>{u.code}</td>
            <td>
            </td>
            <td>{u.name}</td>
            <td>
              <img 
                src={`/asset's/Risk_${u.tier}.webp`} 
                width={48} 
                onClick={() => toggleFilter("tier", u.tier)} 
                tabIndex={0}
                onMouseEnter={() => setFocusedId(u.id)}
                onMouseLeave={() => setFocusedId(null)}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: focusedId === u.id ? 'scale(1.5)' : 'scale(1)',
                  position: 'relative',
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
