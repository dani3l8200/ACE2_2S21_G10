import axios from 'axios';
import Alert from 'components/alerts/Alert';
import HeartBeat from 'components/cards/stats/HeartBeat';
import Oxygen from 'components/cards/stats/Oxygen';
import Temperature from 'components/cards/stats/Temperature';
import Loader from 'components/loader/Loader';
import StatTable from 'components/tables/stats/StatTable';
import { urlServer } from 'config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from 'services/user';
import { netBurn } from 'services/calories';
import Calculator from 'components/modal/stats/Calculator';


const Dashboard = () => {
  const [laps, setLaps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [netCalories, setNetCalories] = useState(0);
  const [data, setData] = useState([]);
  /// Hook para mostrar un alerta
  const [alert, setAlert] = useState(
    <Alert
      onStateChange={() => { setAlert() }}
      title="¿Cómo funciona?"
      variant="info"
      message={<ul className="m-0 fs-6">
        <li>Selecciona una fila de la tabla y visualiza las estadísticas para ese entrenamiento en las tarjetas de <strong>Ritmo cardíaco, Temperatura y Oxígeno</strong></li>
        <li>Limpia la selección presionando <strong>Deshacer selección</strong></li>
        <li>Visualiza las estadísticas en tiempo real presionando <strong>Entrenamiento actual</strong></li>
      </ul>}
    />
  );

  useEffect(() => {
    const userInfo = getUser();
    const endpoint = urlServer + `obtener-calorias/${userInfo.IdUser}`;
    axios.get(endpoint)
      .then((response) => {
        if (response.data.length) {
          const data = response.data;
          setCalories(data.reduce((n0, n1) => {
            return n0 + n1.calperminute;
          }, 0));
          setLaps(data.length);
          const dataMap = data.map((value) => {
            const arrCal = value.arrayCaloriasPorSegundo;
            return {
              lap: arrCal[0].repeticion,
              totalCal: value.calperminute,
              netBurn: netBurn(value.calperminute)
            };
          });
          setData(dataMap);
          setNetCalories(dataMap.reduce((n0, n1) => n0 + n1.netBurn, 0));
        }
      })
      .catch((e) => { console.error(e) });
  }, [calories]);
  return (
    <>
      <div className="row gap-0">
        <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 mb-2">
          <div className="card rounded mb-2">
            <div className="card-body">
              {alert}
              <div className="d-grid gap-2">
                <Link to="/dashboard" className="btn btn-outline-dark">
                  <i className="fa fa-undo"></i>{' '}
                    Deshacer selección
                  </Link>
                <Link to='/realtime' className="btn btn-outline-dark">
                  <i className="fa fa-running"></i>{' '}
                  Entrenamiento actual
                </Link>
                <button type="button" 
                  className="btn btn-outline-dark"
                  data-bs-toggle="modal" data-bs-target="#modalCalculator" >
                  <i className="fa fa-calculator"></i>{' '}
                  Calculadora
                </button>
                <Calculator id={"modalCalculator"}/>
              </div>
            </div>
          </div>
          <div className="card rounded bg-lap mb-2">
            <div className="card-body text-light">
              <div className="card-title h3">
                {laps + ' '}
                <i className="fa fa-running"></i>
              </div>
               Entrenamientos
            </div>
          </div>
          <div className="row gap-0">
            <div className="col me-0">
              <div className="card rounded mb-2 bg-calories">
                <div className="card-body text-dark">
                  <div className="card-title h3">
                    {calories + ' '}
                    <i className="fa fa-fire-alt"></i>
                  </div>
              Calorías quemadas
              </div>
              </div>
            </div>
            <div className="col ms-0">
              <div className="card rounded mb-2 bg-calories">
                <div className="card-body text-dark">
                  <div className="card-title h3">
                    {netCalories + ' '}
                    <i className="fa fa-fire-alt"></i>
                  </div>
              Calorías netas
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-md-6 col-sm-12 col-xs-12 mb-2">
          {data.length ?
            <StatTable
              data={data}
              columns={
                [
                  {
                    Header: 'Entrenamiento No.',
                    accessor: 'lap'
                  },
                  {
                    Header: 'Calorías quemadas',
                    accessor: 'totalCal'
                  },
                  {
                    Header: 'Calorías netas',
                    accessor: 'netBurn'
                  }
                ]
              } /> : <Loader />}
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
          <Oxygen />
          <HeartBeat />
          <Temperature />
        </div>
      </div>
    </>
  );
}

export default Dashboard;