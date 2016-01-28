import numeral from 'numeral';

/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

class FinancesAccountsTable extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {  };
  }

  render() {

    let accountRows = _.map(this.props.accounts, (accountObj, idx) => {
      return (
        <tr key={accountObj.accountId}>
          <td>{(accountObj.fiLoginDisplayName) ? (accountObj.fiLoginDisplayName) : accountObj.accountName}</td>
          <td>{numeral(accountObj.value).format('$0,0')}</td>
        </tr>
      )
    });

    return (
      <table className='finances-accounts-table'>
        <thead>
          <tr>
            <th>{'Account Name'}</th>
            <th>{'Value'}</th>
          </tr>
        </thead>
        <tbody>
          {accountRows}
        </tbody>
      </table>
    );
  }
}

FinancesAccountsTable.displayName = 'FinancesAccountsTable';

FinancesAccountsTable.propTypes = {
  accounts: React.PropTypes.array
};

module.exports = FinancesAccountsTable;
