const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bloc = mongoose.model("Bloc");
const salle = mongoose.model("Salle");
const creneaux = mongoose.model("Creneau");
const occupation = mongoose.model("Occupation");
const { Schema } = require("mongoose");

/**
 * @swagger
 * /salle:
 *   get:
 *     description: Get all blocs available inside select options component in create or update salle form
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle:
 *   post:
 *     description: Create or update a salle
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle/{list}:
 *   get:
 *     description: get a list of all salles
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle/{id}:
 *   get:
 *     description: get a salle by salle id and all blocs in update salle form
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle/planing/{id}:
 *   get:
 *     description: get all occupations for a salle
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle/planing/{id}/{occupationId}:
 *   get:
 *     description: get QR Code of a specific occupation in a specific salle
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle/list/{id}/{qrcode}:
 *   get:
 *     description: get QR Code of a specific salle
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /salle/delete/{id}:
 *   delete:
 *     description: delete a specific salle
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /bloc:
 *   get:
 *     description: get add or edit bloc form
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /bloc:
 *   post:
 *     description: create or update bloc
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /bloc/list:
 *   get:
 *     description: get list of all blocs
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /bloc/{id}:
 *   get:
 *     description: get bloc by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /bloc/delete/{id}:
 *   delete:
 *     description: delete bloc by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/api:
 *   get:
 *     description: get all crenaus
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/api:
 *   post:
 *     description: create crenau
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau:
 *   get:
 *     description: get add or update crenau form
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau:
 *   post:
 *     description: add or update crenau
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/list:
 *   get:
 *     description: get list of all crenaus
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/{id}:
 *   get:
 *     description: get crenau by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/api/list:
 *   get:
 *     description: get list of crenaus in
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/api/{id}:
 *   get:
 *     description: get specific crenau data in update form
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/delete/{id}:
 *   get:
 *     description: delete crenau by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /crenau/api/delete/{id}:
 *   get:
 *     description: delete specific crenaus
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/api:
 *   get:
 *     description: get all occupations
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/api:
 *   post:
 *     description: add occupations
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation:
 *   get:
 *     description: get all salles and crenaus in create occupation form
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation:
 *   post:
 *     description: create or update occupation
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/list:
 *   get:
 *     description: get list of all occupations
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/{id}:
 *   get:
 *     description: get occupation by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/delete/{id}:
 *   get:
 *     description: remove occupation by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/api/{id}:
 *   put:
 *     description: update occupation by id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
/**
 * @swagger
 * /occupation/api/{id}:
 *   delete:
 *     description: delete occupation
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Fail
 */
