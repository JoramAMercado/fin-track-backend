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
    checkAccountID,
    validateTransactionOwnership
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
transactions.get("/:transaction_id",
    checkAccountID,
    checkTransactionID,
    async (req, res) => {
        const { account_id, transaction_id } = req.params
        try {
            const oneTransaction = await getOneTransaction(transaction_id)

            if (oneTransaction.error || oneTransaction.err) {
                return res.status(500).json({ error: oneTransaction.error || oneTransaction.err })
            }

            if (!oneTransaction) {
                return res.status(404).json({ error: "Transaction not found" })
            }

            if (oneTransaction.account_id !== account_id) {
                return res.status(404).json({ error: "Transaction not found for this account" })
            }

            return res.status(200).json(oneTransaction)
        } catch (error) {
            console.error("Error fetching one transaction:", error)
            return res.status(500).json({ error: "Internal server error" })
        }
    })

// delete
transactions.delete("/:transaction_id",
    checkAccountID,
    checkTransactionID,
    validateTransactionOwnership,
    async (req, res) => {
        const { transaction_id } = req.params
        try {
            const deletedTransaction = await deleteTransaction(transaction_id)

            if (deletedTransaction.error || deletedTransaction.err) {
                return res.status(500).json({ error: deletedTransaction.error || deletedTransaction.err })
            }

            if (!deletedTransaction) {
                return res.status(404).json({ error: "Transaction not found" })
            }

            return res.status(200).json(deletedTransaction)
        } catch (error) {
            console.error("Error in delete controller path for transactions:", error)
            return res.status(500).json({
                error: `${error} Error in delete controller path for transactions.`
            })
        }
    })


// create

// update

module.exports = transactions