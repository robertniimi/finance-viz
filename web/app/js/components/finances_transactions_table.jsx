/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

// Helpers
import urlencode from 'urlencode';
import numeral from 'numeral';

// Components
import Select from 'react-select';

// Actions
import FinancesActions from 'finances_actions';

class FinancesTransactionsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleTransactionCategoryChange(txnId) {
    return (selectValue) => {
      console.log('[finances] @_handleInputChange -> selectValue: ', selectValue);
    }
  }

  _handleTableCategoryChange(category) {
    console.log('[finances_transactions_table] @_handleTableCategoryChange -> category: ', category);
    this.props.onChangeTableFilter(category);
  }

  render() {
    console.log('[finances_transactions_table] this.props: ', this.props);
    if (this.props.loading) {
      return (
        <div>{'Loading'}</div>
      );
    };

    let selectOptions = _.reduce(this.props.categories, (result, category, idx) => {
      result.transaction.push({
        label: category.value,
        value: category.id,
        name: category.value
      });

      result.filter.push({
        label: category.value,
        value: `category: ${ category.value }`
      });

      if (category.children) {
        _.forEach(category.children, (subcategory, idx) => {
          result.transaction.push({
            label: `${ category.value } > ${ subcategory.value }`,
            value: subcategory.id,
            name: subcategory.value,
            id: subcategory.id
          });

          result.filter.push({
            label: `${ category.value } > ${ subcategory.value }`,
            value: `category=: ${ subcategory.value }`
          })
        });
      };
      return result;
    }, {
      filter: [],
      transaction: []
    });

    console.log('[finances_transactions_table] selectOptions: ', selectOptions);

    let transactionRows = _.map(this.props.data, (transaction) => {
      return (
        <tr key={`${transaction.id}`}>
          <td className='data-date'>{ transaction.date }</td>
          <td className='data-merchant'>
            <a href={`https://www.google.com/#safe=off&q=${ urlencode(transaction.omerchant) }`} target='_blank'>
              { transaction.omerchant }
            </a>
          </td>
          <td className='data-amount'>{ numeral(transaction.amount).format('$0,0.00') }</td>
          <td className='data-category'>
            <Select
              value={ transaction.categoryId }
              name={`transaction-select-${transaction.id}`}
              options={ selectOptions.transaction }
              onChange={ this._handleTransactionCategoryChange(transaction.id).bind(this) }
            />
          </td>
        </tr>
      );
    });

    return (
      <div className='finances-transactions-table'>
        <div className='table-actions'>
          <label>{'Table Filters'}</label>
          <Select
            name='finances-transaction-table-filter-select'
            options={ selectOptions.filter }
            onChange={ this._handleTableCategoryChange.bind(this) }
            value={ this.props.query }
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {transactionRows}
          </tbody>
        </table>
      </div>
    );
  }
}

FinancesTransactionsTable.displayName = 'FinancesTransactionsTable';

FinancesTransactionsTable.propTypes = {
  categories: React.PropTypes.array,
  data: React.PropTypes.array,
  error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  loading: React.PropTypes.bool,
  onChangeTableFilter: React.PropTypes.func,
  query: React.PropTypes.string
};

module.exports = FinancesTransactionsTable;
