const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

exports.handler = (event, context, callback) => {
  console.log("Welcome to report distancia alcanzada!");
  const params = {
    TableName: "Sensors",
  };

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      let array = data.Items;
      let length = array.length;
      let dataFallos = [];
      for (let index = 0; index < length; index++) {
        if (event.idUser === array[index].idUser.S) {
          dataFallos.push({
            fallo: +array[index].falla.N,
            repeticion: +array[index].repeticion.N,
            dateTime: array[index].dateTime.S,
          });
        }
      }
      let items = null;
      dataFallos.sort(dynamicSort("dateTime"));
      let result = calculateData(dataFallos);
      if (result.length > 0) {
        items = result;
      }
      callback(null, items);
    }
  });
};

function calculateData(dataFallos) {
  let index = 0;
  let countFallos = 0;
  let result = [];
  while (true) {
    if (index > dataFallos.length - 1) {
      break;
    }

    /***************************************************************************************************************************/
    if (index + 1 > dataFallos.length - 1) {
      if (dataFallos.length === 1) {
        let dataResult = {
          fallos: countFallos,
          repeticiones: dataFallos[index].repeticion,
          hora: dataFallos[index].dateTime,
        };
        result.push(dataResult);
        break;
      } else {
        if (dataFallos[index].fallo === 0) {
          if (
            dataFallos[index - 1].repeticion === dataFallos[index].repeticion
          ) {
            break;
          } else {
            break;
          }
        } else {
          if (
            dataFallos[index - 1].repeticion === dataFallos[index].repeticion
          ) {
            countFallos += 1;
            let dataResult = {
              fallos: countFallos,
              repeticiones: dataFallos[index].repeticion,
              hora: dataFallos[index].dateTime,
            };
            result.push(dataResult);
            break;
          } else {
            countFallos += 1;
            let dataResult = {
              fallos: countFallos,
              repeticiones: dataFallos[index].repeticion,
              hora: dataFallos[index].dateTime,
            };
            result.push(dataResult);
            break;
          }
        }
      }
    }
    /*********************************************************************************************************************************/
    if (dataFallos[index].fallo === 0) {
      if (dataFallos[index].repeticion === dataFallos[index + 1].repeticion) {
      } else if (dataFallos[index].repeticion != dataFallos[index + 1]) {
      }
    } else if (
      dataFallos[index].fallo != dataFallos[index + 1].fallo &&
      dataFallos[index + 1].fallo === 0
    ) {
      if (dataFallos[index].repeticion === dataFallos[index + 1].repeticion) {
        countFallos += 1;
        let dataResult = {
          fallos: countFallos,
          repeticiones: dataFallos[index].repeticion,
          hora: dataFallos[index].dateTime,
        };
        result.push(dataResult);
      } else if (
        dataFallos[index].repeticion != dataFallos[index + 1].repeticion
      ) {
        countFallos += 1;
        let dataResult = {
          fallos: countFallos,
          repeticiones: dataFallos[index].repeticion,
          hora: dataFallos[index].dateTime,
        };
        result.push(dataResult);
      }
    } else if (dataFallos[index].fallo === dataFallos[index + 1].fallo) {
      countFallos += 1;
      let dataResult = {
        fallos: countFallos,
        repeticiones: dataFallos[index].repeticion,
        hora: dataFallos[index].dateTime,
      };
      result.push(dataResult);
    }
    index += 1;
  }
  /*********************************************************************************************************************************/
  if (result.length === 0) {
    result.push({ fallos: 0, repeticiones: 0 });
  }
  let data = 0;
  for (let index = 0; index < result.length; index++) {
    const element = result[index].repeticiones;
    data += element;
  }
  let result2 = [];
  result2.push({
    result: result,
    repeticionesTotales: data,
    fallosTotales: countFallos,
  });
  return result2;
}

function getData(arrRepeticiones) {
  const sumatoria = (arr) => arr.reduce((p, c) => p + c, 0);
}

function dynamicSort(property) {
  let sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    let result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
