import expressAsyncHandler from "express-async-handler";
import db from '../db/queries.mjs';
import { query, body, validationResult } from "express-validator";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 255 characters.";
const sizeErr = "must be XS,S,M,L,XL,XXL"
const priceErr = "must be an amount in dollars"
const priceAmountErr = "must be less than $10000"

const validateNewProduct = [
  body("createName").trim()
    .isAlpha().withMessage(`Name ${alphaErr}`)
    .isLength({ min: 1, max: 255 }).withMessage(`Name ${lengthErr}`),
  body("createSize").trim().toUpperCase()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL']).withMessage(`Size ${sizeErr}`),
  body("createColor").trim()
    .isAlpha().withMessage(`Color ${alphaErr}`)
    .isLength({ min: 1, max: 255 }).withMessage(`Color ${lengthErr}`),
  body("createPrice").trim()
    .isNumeric().withMessage(`Price ${priceErr}`)
    .isLength({ min: 1, max: 5 }).withMessage(`Price ${priceAmountErr}`)
];

const renderCreateItem = expressAsyncHandler(async (req, res) => {
    const categorie = req.params.categorie;
    const allCategories = await db.getAllCategories()

    res.render('create', { categorie: categorie, categories: allCategories })
})

const createProductInTable = [
    validateNewProduct,
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }
        res.redirect('/')
    }
]

export default { renderCreateItem, createProductInTable };