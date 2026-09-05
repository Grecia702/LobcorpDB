import express  from 'express'
import Database  from 'better-sqlite3'
import cors from 'cors';
import path  from 'path'
import type {abno} from './shared/types/types'
import abnoData from './abno.json'

const app = express()
const db = new Database('abnoDB.sqlite');

app.use(cors({
  origin: 'http://localhost:5173', 
}));

const query = 'INSERT OR IGNORE INTO abnormalities (code, portrait, name, tier, hp, resistances, qlipoth, workDamage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
db.exec('CREATE TABLE IF NOT EXISTS abnormalities (id INTEGER PRIMARY KEY, code TEXT, portrait TEXT, name TEXT UNIQUE, tier TEXT, hp INTEGER, resistances TEXT, qlipoth INTEGER, workDamage TEXT)');

const stmt = db.prepare(query);

for(const abno of abnoData) {
  const arr = [abno.code, abno.portrait, abno.name, abno.tier, abno.hp, JSON.stringify(abno.resistances), abno.qlipoth, abno.workDamage]
  stmt.run(arr)
}

app.use("/image", express.static(path.join(__dirname, "imagens"), {
  setHeaders: (res) => {
    res.set("Content-Type", "image/webp");
  }
}));

let allABnos = db.prepare('SELECT * FROM abnormalities').all()
let parsedAbnos = allABnos.map(r =>   ({
  ...r as abno,
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
