import Stocks from '../controllers/stock'

const stocks = new Stocks()

const createStock = async (req, res) => {
	try {
		const newStock = {
			...req.body,
		}

		const data = stocks.createStock(newStock)

		res.json({ succes: true, data })
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
}

const getAllStocks = async (req, res) => {
	try {
		const data = stocks.getAllStocks()

		res.json({ succes: true, data })
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
}

const getStock = async (req, res) => {
	try {
		const stockData = req.body
		const data = stocks.getStock(stockData)

		res.json({ succes: true, data })
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
}

const updateStock = async (req, res) => {
	try {
		const findData = { id: req.params.id }
		const stockData = req.body

		const data = stocks.updateStock(findData, stockData)

		res.json({ succes: true, data })
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
}

export default {
	createStock,
	getAllStocks,
	getStock,
	updateStock,
}
