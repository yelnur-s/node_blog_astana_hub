const Category = require('./Category');
async function createCategories() {
   const number = await Category.count().exec();

   const values = [
       { name: "Прогнозы в IT", 
        slug: "it-predict"},
       {
           name: "Веб-разработка",
            slug: "web-dev"
       },
       {
        name: "Мобильная разработка",
         slug: "mobile-dev"
    },
    {
        name: "Фриланс",
         slug: "freelance"
    },
    {
        name: "Алгоритмы",
         slug: "algo"
    },
    {
        name: "Тестирование IT систем",
         slug: "testing"
    },
    {
        name: "Разработка игр",
         slug: "game-dev"
    },
    {
        name: "Дизайн и юзабилити",
         slug: "ui-ux"
    },
    {
        name: "Искуственный интелект",
         slug: "ai"
    },
    {
        name: "Машинное обучение",
         slug: "ml"
    }
   ]
   if(number === 0) {
       values.map(async value => {
            await new Category(value).save()
       })
   }
}
module.exports = {
    createCategories
}