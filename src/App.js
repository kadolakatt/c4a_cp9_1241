import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';

/*
Datos de conexion API
Public key: eee8dbdf35beadab8d05c92849436775
Private key: 5cfc8eee0a4f0cc7034185ec03360d98001ae013

https://gateway.marvel.com:443/v1/public/characters?apikey=eee8dbdf35beadab8d05c92849436775

Entrada del hash: ts+privatekey+publickey
ts=1
15cfc8eee0a4f0cc7034185ec03360d98001ae013eee8dbdf35beadab8d05c92849436775

Hash MD5 generado: 1850c453e78910ae279ac45f5549a0c4

*/
function App() {

  const [listaPersonajes, setListaPersonajes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const elements = 8;

  useEffect(function() {
    setShowLoading(true);
    const url = "https://gateway.marvel.com:443/v1/public/characters?" +
                "ts=1&" +
                "apikey=eee8dbdf35beadab8d05c92849436775&"+
                "hash=1850c453e78910ae279ac45f5549a0c4&" +
                "limit=" + elements + "&" +
                "offset=" + ((page-1) * elements);
    axios.get(url)
         .then(function(respuestaServidor) {
            setListaPersonajes(respuestaServidor.data.data.results);
            setTotalElements(respuestaServidor.data.data.total);
            setShowLoading(false);
         })
         .catch(function (errorServidor) {
           console.log(errorServidor);
         })
  },[ page, elements ]);

  const componentePersonajes = listaPersonajes.map( p => (
    <div className="col-sm-3" key={p.id}>
      <Card className="mt-2 mb-2" style={{height: '40rem'}}>
        <Card.Img variant="top" style={{ height: '20rem'}}
                  src={`${p.thumbnail.path}.${p.thumbnail.extension}`} >
        </Card.Img>
        <Card.Body>
          <Card.Title>{p.name}</Card.Title>
          <Card.Text style={{ fontSize: "10px" }}>
            { Boolean(p.description) ? p.description : 'No registra' }
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  ));

  const Paginator = function () {

    const onPrevio = function () {
      if (page>=2) {
        setPage(parseInt(page)-1);
      }
    }

    const onSiguiente = function() {
      if (page < (Math.ceil(totalElements/elements))) {
        setPage(parseInt(page)+1);
      }
    }

    return (
      <nav className="mt-2">
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link btn-primary text-white" onClick={ onPrevio }>Previo</button>
          </li>
          <li className="page-item p-2">
            <label>Pagina {page} de {Math.ceil(totalElements/elements)} </label>
          </li>
          <li className="page-item">
            <button className="page-link btn-primary text-white" onClick={ onSiguiente }>Siguiente</button>
          </li>
        </ul>
      </nav>
    );
  }


  return (
    <div className="container">
      <Card className="bg-primary text-white mt-5">
        <Card.Body>
          <Card.Title>
            <h1>Personajes de Marvel</h1>
          </Card.Title>
          <Card.Text>
            <p>Bienvenido a mi biblioteca de personajes de Marvel.</p>
          </Card.Text>
        </Card.Body>
      </Card>
      <Paginator />
      <Card className="mt-5">
        <Card.Body>
          <div className="row">
            { showLoading ? <div className="col-sm-12 text-center"><Spinner animation="border" variant="primary" /></div> : componentePersonajes }
          </div>
        </Card.Body>
      </Card>
      <Paginator />
    </div>
  );
}

export default App;
