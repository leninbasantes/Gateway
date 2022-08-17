"use strict";

var db = require("../db");
var config = require("../config");
var request = require("request");
// const whatsappURL =
//   "https://aiot.constecoin.com/api/notificationWhatsapp/sendWhatsapp";

  const whatsappURL =
  "http://localhost:51128/sendWhatsapp";

function getDevice(id) {
  var collection = db
    .get()
    .db(config.getDataBase())
    .collection(config.getCollDevice());
  return new Promise((resolve, reject) => {
    collection.findOne({ deviceID: id }, function (err, result) {
      if (err) {
        reject({
          error: "error2",
          message: "Error al obtener documento",
        });
      } else if (result == null) {
        reject({
          error: "error2",
          message: "No existe dispositivo con ese id",
        });
      } else {
        resolve(result);
      }
    });
  });
}

function sendWhatsapp(body) {
  const requestOptions = {
    method: "POST",
    url: whatsappURL,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  return new Promise((resolve, reject) => {
    request(requestOptions, function (error, response) {
      if (error) {
        reject({
          error: "error2",
          message: "Fallo en la api de wpp",
        });
        return;
      } else {
        resolve(response);
      }
    });
  });
}

async function updateCountMessage(id, phones) {
  var collection = db
    .get()
    .db(config.getDataBase())
    .collection(config.getCollDevice());
  var device;
  var messageNumber;

  device = await getDevice(id);

  messageNumber = parseInt(device.messageCount);
  messageNumber += phones.length;

  return new Promise((resolve, reject) => {
    collection.findOneAndUpdate(
      { deviceID: id },
      { $set: { messageCount: messageNumber.toString() } },
      (err, result) => {
        if (err) {
          reject({
            error: "error2",
            message: "Error en la actualizacion del documento",
          });
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function saveData(req, res) {
  const id = req.body.deviceID.split("+")[1];
  const timeStamp = req.body.t_stamp;
  let smsCont = req.body.sms_cont;
  let error = false;
  let telephones;
  let data = [];
  let template;
  let device;
  let body;
  let signalQuality;
  let linkMaps;
  let battery;
  var collection;
  let documento;

  console.log("Antes");

  device = await getDevice(id).catch((e) => {
    error = true;
    return res.status(500).send(e.message);
  });

  console.log("durante");

  if (device.paid && !error) {
    console.log("despues");
    telephones = device.phones;

    documento = {
      deviceID: id,
      t_stamp: timeStamp,
      sms_cont: smsCont,
      organizacion: device.organizacion,
    };

    if (smsCont[0] == "R") {
      collection = db
        .get()
        .db(config.getDataBase())
        .collection(config.getCollData());

      template = "reporteAlcantarilla";
      smsCont = smsCont.split(" ");
      smsCont = smsCont[1].split("--");
      battery = smsCont[0].split("=")[1];
      signalQuality = smsCont[1].split(":")[1];

      data = [id, battery, signalQuality, timeStamp];

      body = {
        template: template,
        data: data,
        phones: telephones,
      };
    } else {
      template = "alertaAlcantarilla";
      linkMaps = `https://www.google.com/maps/search/?api=1&query=${device.coordenadas.lat},${device.coordenadas.lng}`;
      data = [id, smsCont, timeStamp, linkMaps];

      collection = db
        .get()
        .db(config.getDataBase())
        .collection(config.getCollAlarm());

      body = {
        template: template,
        data: data,
        phones: telephones,
      };
    }

    await sendWhatsapp(body).catch((e) => {
      error = true;
      return res.status(500).send(e.message);
    });

    if (!error) {
      saveD(collection, documento).then(
        (result) => {
          console.log("Se guardo");
        },
        (error) => {
          console.log(error.message);
        }
      );
      updateCountMessage(id, telephones);
      return res.status(200).send("ok");
    }
  }
}

function saveD(collection, documento) {
  console.log(documento);
  return new Promise((resolve, reject) => {
    collection.insertOne(documento, (err) => {
      if (err) {
        console.log(err);
        reject({
          error: "error2",
          message: "Error en la creaci�n del documento",
        });
      } else {
        resolve({ mensaje: "registro aceptado" });
      }
    });
  });
}

module.exports = {
  saveData,
};
