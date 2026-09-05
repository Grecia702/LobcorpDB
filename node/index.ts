import express  from 'express'
import Database  from 'better-sqlite3'
import cors from 'cors';
import path  from 'path'
import type {abno} from './shared/types/types'

const app = express()
const db = new Database('abnoDB.sqlite');

app.use(cors({
  origin: 'http://localhost:5173', 
}));

const query = 'INSERT OR IGNORE INTO abnormalities (code, portrait, name, tier, hp, resistances, qlipoth) VALUES (?, ?, ?, ?, ?, ?, ?)'
const abnos = [
  ['O-06-20','nothingthere' ,'Nothing there', 'Aleph', 2000,JSON.stringify({Red: 'immune', White: 0.4, Black: 0.4, Pale: 0.8}), 2],
  ['T-03-46','whitenight','White night', 'Aleph', 12000, JSON.stringify({Red: 0.5, White: -2, Black: 0.5, Pale: 0.2}), 3],
  ['O-02-62','judgementbird','Judgement bird', 'Waw', 800, JSON.stringify({Red: 0.8, White: 0.8, Black: 0.8, Pale: 2}), 3],
  ['O-01-04','queenofhatred','The Queen Of Hatred', 'Waw', 1200, JSON.stringify({Red: 0.7, White: 1.2, Black: 0.3, Pale: 1.5}), 2],
  ['O-02-40','bigbird','Big Bird', 'Waw', 1600, JSON.stringify({Red: 0.8, White: 1.2, Black: 0.5, Pale: 1.5}), 5],
  ['T-04-06','teddybear','Happy Teddy Bear', 'He', 'X', JSON.stringify({Red: 'Unspecified', White: 'Unspecified', Black: 'Unspecified', Pale: 'Unspecified'}), 0],
  ['O-01-92','todayshylook',"Today's Shy Look", 'He', 'X', JSON.stringify({Red: 'Unspecified', White: 'Unspecified', Black: 'Unspecified', Pale: 'Unspecified'}), 0],
  ['T-02-43','spiderbud','Spider Bud', 'Teth', 'X', JSON.stringify({Red: 'Unspecified', White: 'Unspecified', Black: 'Unspecified', Pale: 'Unspecified'}), 0],
  ['T-01-31','silentorchestra','Silent Orchestra', 'Aleph', 1600, JSON.stringify({Red: 'Unspecified', White: 'Unspecified', Black: 'Unspecified', Pale: 'Unspecified'}), 2],
  ['F-01-57','redhood','Little Riding Red Hooded Mercenary', 'Waw', 1000, JSON.stringify({Red: 0.9, White: 0.6, Black: 0.8, Pale: 1.2}), 3],
]

db.exec('CREATE TABLE IF NOT EXISTS abnormalities (id INTEGER PRIMARY KEY, code TEXT, portrait TEXT, name TEXT UNIQUE, tier TEXT, hp INTEGER, resistances TEXT, qlipoth INTEGER)');

const stmt = db.prepare(query);

for(const abno of abnos) {
  stmt.run(abno)
}

app.use("/image", express.static(path.join(__dirname, "imagens"), {
  setHeaders: (res) => {
    res.set("Content-Type", "image/webp");
  }
}));

let allABnos = db.prepare('SELECT * FROM abnormalities').all()
let parsedAbnos = allABnos.map(r =>   ({
  ...r,
  resistances: JSON.parse(r.resistances)
}))
console.log(allABnos)

const port = 3000
const host = '0.0.0.0'

app.get('/', (req, res) => {
  res.send(parsedAbnos)
})

app.post('/new', (req, res) => {
  try {
    const {name, tier, hp, resistances} = req.body
    db.prepare('INSERT OR IGNORE INTO abnormalities (name, tier, hp, resistances) VALUES (?,?,?,?)').run(name, tier, hp, resistances)
    res.status(200).send({message: 'sucesso'})
  } catch (error) {
    res.status(400).send({message: 'erro'})
  }
})

app.listen(port, host, () => {
  console.log(`server rodando em http//${host}:${port}`)
})
