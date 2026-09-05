import { useState, useEffect } from 'react'
import { useQuery} from '@tanstack/react-query';
import './App.css'
import type { abno } from '../../node/shared/types/types'
import { MdExpandLess, MdExpandMore } from "react-icons/md";

function App() {
  const url = 'http://127.0.0.1:3000'
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const [text, setText] = useState<string>('')
  const [dados, setDados] = useState([])
  const [visible, setVisible] = useState(false)
  const [filters, setFilters] = useState<string[]>([])

  const { data: abnos, isLoading, isError, error } = useQuery({
    queryKey: ['abnos'],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      setDados(abnos)
      return res.json();
    },
  });
  
  useEffect(() => {
    if (abnos) setDados(abnos)
  }, [abnos])

  const riskLevel = [
    "Zayin",
    "Teth",
    "He",
    "Waw",
    "Aleph",
  ]

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro: {error.message}</p>;

  const addFilter = (filter: string) => {
    setFilters([...filters, filter])
  }

  const removeFilter = (filter: string) => {
    setFilters(filters.filter(x=> x != filter))
  }

  const handleInput = (text: string) => {
    const filterData = abnos?.filter((x : abno)=> x.name.includes(text) || x.code.includes(text))
    setDados(filterData)
    setText(text)
  }

  return (
    <>
      {/* <p style={{color: '#fffea1', fontFamily: 'Norwester', fontWeight: 'bold', marginBottom: '16px'}}>LOBPEDIA</p> */}
      <div style={{marginBottom: '24px', display: 'flex', flexDirection: 'column'}}>
        <input
          className='search'
          placeholder='Pesquisar...' 
          value={text} 
          onChange={(e) => {handleInput(e.target.value)}}>
        </input>
        <div 
          className='filter'
          style={{display:'flex', flexDirection: 'column', maxWidth: visible ? '5 50px': '300px'}}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '6px'}}>
            <span className='text' >Advanced filters </span>
            <button
              className='icon'
              style={{all:'unset'}}
              onClick={() => setVisible(!visible)}
              >
              {visible ? <MdExpandLess color='#fffea1'/> : <MdExpandMore color='#fffea1'/>}
            </button>
          </div>
          { visible  &&
            <div style={{ display: 'flex', flexDirection: 'row', borderTop: '2px #fffea1 solid', padding: '6px', gap: '12px'}}>
              <p className='text' style={{ alignSelf: 'flex-start', textAlign: 'left'}}>Risk Level: </p>
              {riskLevel.map(x => 
                <button className='btn' onClick={() => }>
                  {x}
                </button>
              )}
            </div>
          }
        </div>

      </div>
      <table style={{  border: '1px solid #378ADD'}}>
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Portrait</th>
            <th scope="col">Name</th>
            <th scope="col">Risk Level</th>
            <th scope="col">HP</th>
            <th scope="col">Qlipoth Counter</th>
            <th scope="col">Resistances</th>
          </tr>
        </thead>
        <tbody>
          {dados?.map((u : abno) => 
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
                onClick={() => addFilter(u.tier)} 
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
