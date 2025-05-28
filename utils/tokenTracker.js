const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment');

class TokenTracker {
    constructor(spreadsheetId, credentials) {
        this.doc = new GoogleSpreadsheet(spreadsheetId);
        this.credentials = credentials;
    }

    async init() {
        await this.doc.useServiceAccountAuth(this.credentials);
        await this.doc.loadInfo();
        this.sheet = this.doc.sheetsByIndex[0] || await this.doc.addSheet({ headerValues: [
            'Timestamp',
            'Prompt Tokens',
            'Completion Tokens',
            'Total Tokens',
            'Cost (USD)',
            'Endpoint',
            'Status',
            'Error'
        ]});
    }

    async logUsage({ promptTokens, completionTokens, endpoint, status = 'success', error = '' }) {
        const totalTokens = promptTokens + completionTokens;
        // AI21's Jurassic-2 pricing (as of 2024)
        const costPerToken = 0.00015; // $0.00015 per token
        const cost = totalTokens * costPerToken;

        await this.sheet.addRow({
            'Timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
            'Prompt Tokens': promptTokens,
            'Completion Tokens': completionTokens,
            'Total Tokens': totalTokens,
            'Cost (USD)': cost.toFixed(6),
            'Endpoint': endpoint,
            'Status': status,
            'Error': error
        });
    }

    async getMonthlyStats() {
        const rows = await this.sheet.getRows();
        const currentMonth = moment().format('YYYY-MM');
        
        const monthlyStats = rows.reduce((stats, row) => {
            const rowMonth = moment(row['Timestamp']).format('YYYY-MM');
            if (rowMonth === currentMonth) {
                stats.totalTokens += parseInt(row['Total Tokens']) || 0;
                stats.totalCost += parseFloat(row['Cost (USD)']) || 0;
                stats.totalRequests++;
            }
            return stats;
        }, { totalTokens: 0, totalCost: 0, totalRequests: 0 });

        return monthlyStats;
    }
}

module.exports = TokenTracker; 