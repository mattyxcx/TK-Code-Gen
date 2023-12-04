const express = require('express')
const axios = require('axios')
const router = express.Router()

const w_filters = {
  "w_apparel": "hierarchical_categories.lvl1:=[`Women > clothing`]",
  "w_shoes": "hierarchical_categories.lvl1:=[`Women > shoes`]",
  "w_top": "hierarchical_categories.lvl2:=[`Women > clothing > tops`]",
  "w_knit": "hierarchical_categories.lvl2:=[`Women > clothing > knitwear`]",
  "w_denim": "hierarchical_categories.lvl2:=[`Women > clothing > jeans`]",
  "w_bottoms": "hierarchical_categories.lvl2:=[`Women > clothing > trousers-skirts+shorts`]",
  "w_lingerie": "hierarchical_categories.lvl2:=[`Women > clothing > lingerie+nightwear`]",
  "w_dresses": "hierarchical_categories.lvl2:=[`Women > clothing > dresses`]",
  "w_outer": "hierarchical_categories.lvl2:=[`Women > clothing > jackets+coats`]",
  "w_active": "hierarchical_categories.lvl2:=[`Women > clothing > outdoor`, `Women > clothing > gym+workout`, `Women > clothing > ski+snowboarding`]",
  "w_swim": "hierarchical_categories.lvl2:=[`Women > clothing > swimwear+beachwear`]",
  "w_acc": "hierarchical_categories.lvl2:=[`Women > accessories > hats-scarves+gloves`, `Women > accessories > belts`]",
}

const m_filters = {
  "m_apparel": "hierarchical_categories.lvl1:=[`Men > clothing`]",
  "m_shoes": "hierarchical_categories.lvl1:=[`Men > shoes`]",
  "m_top": "hierarchical_categories.lvl2:=[`Men > clothing > t-shirts+polo-shirts`]",
  "m_shirt": "hierarchical_categories.lvl2:=[`Men > clothing > shirts`]",
  "m_knit": "hierarchical_categories.lvl2:=[`Men > clothing > knitwear`]",
  "m_denim": "hierarchical_categories.lvl2:=[`Men > clothing > jeans`]",
  "m_bottoms": "hierarchical_categories.lvl2:=[`Men > clothing > trousers+chinos`]",
  "m_outer": "hierarchical_categories.lvl2:=[`Men > clothing > jackets+coats`]",
  "m_basic": "hierarchical_categories.lvl2:=[`Men > clothing > underwear+socks`, `Men > clothing > pyjamas-loungewear-robes+slippers`]",
  "m_tailor": "hierarchical_categories.lvl2:=[`Men > clothing > suits+tailoring`, `Men > clothing > mens-blazers+waistcoats`, `Men > clothing > suits`]",
  "m_shorts": "hierarchical_categories.lvl2:=[`Men > clothing > shorts`]",
  "m_active": "hierarchical_categories.lvl2:=[`Men > clothing > outdoor`, `Men > clothing > gym+workout`, `Men > clothing > ski-jackets`]",
  "m_acc": "hierarchical_categories.lvl2:=[`Men > accessories > hats-gloves+scarves`, `Men > accessories > bags-wallets+belts`, `Men > accessories > caps`]",
}

const u_filters = {
  "all": "",
  "shoes": "hierarchical_categories.lvl1:=[`Men > shoes`, `Women > shoes`]",
  "athleisure": "hierarchical_categories.lvl2:=[`Men > accessories > athleisure`,`Women > accessories > athleisure`]", 
  "purses": "hierarchical_categories.lvl2:=[`Women > accessories > purses`]", 
  "handbags": "hierarchical_categories.lvl2:=[`Women > accessories > handbags`]",
  "luggage": "hierarchical_categories.lvl2:=[`Women > accessories > luggage+travel-accessories`, `Men > accessories > luggage+travel-accessories`]",
  "jewellery": "hierarchical_categories.lvl2:=[`Women > accessories > jewellery`, `Women > accessories > watches`, `Women > accessories > watches+jewellery`, `Women > accessories > jewellery`, `Men > accessories > jewellery`]",
  "opticals": "hierarchical_categories.lvl2:=[`Women > accessories > glasses`, `Women > accessories > sunglasses+optical-frames`, `Men > accessories > sunglasses+optical-frames`]", 
}

const dept_to_filter = {
  "01": w_filters.w_apparel,
  "02": u_filters.athleisure,
  "03": w_filters.w_top,
  "04": w_filters.w_top,
  "05": w_filters.w_knit,
  "06": w_filters.w_denim,
  "07": w_filters.w_active,
  "08": m_filters.m_apparel,
  "09": w_filters.w_apparel,
  "10": u_filters.luggage,
  "11": u_filters.handbags,
  "12": w_filters.w_apparel,
  "13": u_filters.opticals,
  "15": w_filters.w_apparel,
  "17": w_filters.w_active,
  "18": u_filters.purses,
  "19": w_filters.w_acc,
  "20": m_filters.m_basic,
  "21": m_filters.m_top,
  "22": m_filters.m_active,
  "23": m_filters.m_tailor,
  "24": m_filters.m_outer,
  "25": w_filters.w_shoes,
  "26": u_filters.shoes,
  "27": m_filters.shoes,
  "29": m_filters.m_apparel,
  "30": w_filters.w_dresses,
  "31": m_filters.m_active,
  "32": m_filters.m_shirt,
  "33": m_filters.m_denim,
  "34": m_filters.m_acc,
  "35": w_filters.w_outer,
  "37": m_filters.m_apparel,
  "38": u_filters.shoes,
  "39": u_filters.shoes,
  "47": m_filters.m_shirts,
  "48": m_filters.m_knit,
  "49": u_filters.m_bottoms,
  "50": w_filters.w_lingerie,
  "51": w_filters.w_swim,
  "52": w_filters.w_lingerie,
  "53": w_filters.w_apparel,
  "55": w_filters.w_acc,
  "56": w_filters.w_bottoms,
  "70": u_filters.jewellery,
  "76": u_filters.jewellery,
  "77": u_filters.shoes,
  "92": m_filters.m_apparel,
}

async function search(query,dept,price) {
  const filter = dept_to_filter[dept] || "";
  var fb = `${filter} && price.value:=${price}`
  await axios({
      method: 'post',
      url: process.env.search_url,
      data: {
            "searches": [
                {
                    "query_by": "label,hierarchical_categories,brandName",
                    "sort_by": "price.value:asc",
                    "collection": "tkmaxx_products",
                    "q": query || "",
                    "filter_by": fb,
                    "page": 1,
                    "per_page": 128
                }
            ]
        }
   })
   .then(async function(r) {
     return r.data
   });
}

router.get('/', (req, res) => {
  res.sendStatus(200).send("OK");
})

router.get('/getsku/:query/:dep/:price', async (req, res, next) => {
  const query = req.params.query
  const dep = req.params.dep
  const price = req.params.price
  const r = await search(query,dep,price)
  if (r.results[0].found !== 0) {
    return res.send(r.results[0].hits)
  } else return res.send({})
});

module.exports = router