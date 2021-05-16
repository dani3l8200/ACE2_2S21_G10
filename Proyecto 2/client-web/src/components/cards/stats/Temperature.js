import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTemperature } from 'services/stats';

const Temperature = () => {
  const params = useParams();
  const [avg, setAvg] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  useEffect(() => {
    getTemperature(params.lap).then((data) => {
      setAvg(data.avg);
      setMin(data.min);
      setMax(data.max);
    }).catch(e => console.error(e));
  }, [params]);
  return (
    <div className="card mb-2">
      <div className="card-body rounded text-light bg-temperature">
        <div className="card-title h4 text-center">
          <i className="fa fa-thermometer"></i>
          {' '}Temperatura (Cº)
        </div>
        <div className="d-flex justify-content-evenly align-items-center">
          <div className="text-center">
            <h5>{avg}</h5>
            <span className="badge bg-light text-dark">avg</span>
          </div>
          <div className="text-center">
            <h5>{max}</h5>
            <span className="badge bg-light text-dark">max</span>
          </div>
          <div className="text-center">
            <h5>{min}</h5>
            <span className="badge bg-light text-dark">min</span>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Temperature;