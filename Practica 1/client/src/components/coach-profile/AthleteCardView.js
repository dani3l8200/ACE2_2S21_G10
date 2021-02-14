export default function AthleteCard() {
    return (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <h4 className="card-title" >Nombre AtletaAtleta</h4>
                        <button className="btn btn-sm btn-outline-dark">
                            <span><i className="fa fa-eye"></i></span>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col">Edad:</div>
                        <div className="col">33 años</div>
                    </div>
                    <div className="row">
                        <div className="col">Sexo:</div>
                        <div className="col">M</div>
                    </div>
                    <div className="row">
                        <div className="col">Estatura:
                    </div>
                        <div className="col">1.89 m.</div>
                    </div>
                    <div className="row">
                        <div className="col">Peso:</div>
                        <div className="col">59 kg.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}