const db = require('../database/models/index.js')
const sequelize = db.sequelize;
const Product = db.Product;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
    validationResult
} = require("express-validator");






const productController = {
    vista: (req, res) => {
        let product = Product.findByPk(req.params.id);
                
        let productRelated = Product.findAll({
            order: [
                [Sequelize.literal('RAND()')]
              ],
        
              limit: 3,

        });
        Promise.all([product, productRelated])
        .then(function([product,productRelated]){
            return res.render("productView",{product:product, productRelated:productRelated})
        })
         
    },
    create: (req, res) => {
        db.Category.findAll()
            .then((categories) => {
                return res.render('addProduct', {
                    categories
                });
            })


    },
    processCreate: (req, res) => {

        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let product = {
                name: req.body.name,
                description: req.body.description,
                price:req.body.price,
                idCategory: req.body.idCategory,
                image: req.file.filename
            }
            Product.create(product)
                .then(p => {


                    return res.send("Producto creado");

                })

        } else {
            db.Category.findAll()
                .then((categories) => {
                    return res.render('addProduct', {
                        categories:categories,errors:errors.mapped(),oldS: req.body
                     })
                     });
        }},
        search : function(req,res){
            Product.findAll({
               where:{
                  name: {[db.Sequelize.Op.like]:req.body.search+"%"} 
               } 
                
           })
           .then(function(buscado){
               return res.render('productSearch',{buscado})
           })
            },
        edit: (req,res)=>{
            

            let update = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description
            }
            if (req.files[0] != undefined) {
                update.image = req.files[0].filename
            }

            Product.update(update,{
                where:{id:req.params.id}
            })
            .then((resultado)=>{
                let url = "/product/"+req.params.id;
                return res.redirect(url)
            })
        },
        delete:(req,res)=>{
            Product.destroy({
                where:{id:req.params.id}})
                .then((resultado)=>{
                   return res.redirect("/category/1")
                })
        },
        addCart:(req,res)=>{
            db.Product.findByPk(req.body.id)
            .then(product=>{
                let store = {
                    quantity: req.body.quantity,
                    price: product.price,
                    state: 0,
                    idProduct: product.id,
                    idUser: req.session.user.id,
                    productName: product.name,
                    totalPrice: product.price * req.body.quantity
                }
                return db.Cart.create(store)
            })
            .then(()=>{
                return res.redirect('/cart')
            })

        }








    }



module.exports = productController;