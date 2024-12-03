const express = require("express")
const transactions = express.Router({ mergeParams: true })
const { getOneAccount } = require("../queries/accounts")

const { getAllTransactions,
    getOneTransaction,
    deleteTransaction,
    createTransaction,
    updateTransaction
} = require("../queries/transactions")
const { checkAmountProvided,
    checkTransactionTypeProvided,
    checkCategoryProvided,
    checkRecurringDetails,
    checkRiskLevelProvided,
    checkTransactionID,
    checkAccountID
} = require("../validations/checkTransactions.js")

// get all
transactions.get("/", checkAccountID, async (req, res) => {
    const { account_id } = req.params
    try {
        const transactionsList = await getAllTransactions(account_id)

        if (transactionsList.err) {
            return res.status(500).json({ error: transactionsList.err })
        }

        if (transactionsList.length === 0) {
            return res.status(200).json([]) 
        }

        return res.status(200).json(transactionsList)
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

// get one

// delete

// create

// update

module.exports = transactions