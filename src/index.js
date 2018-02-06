import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ActiveUser extends React.Component {
  render(){
    const {data, active} = this.props;
    const user = data[active];
    return (
      <div className="additionalInfo">
        <div>
          <table className="table">
            <tbody>
              <tr>
                <td>User:</td>
                <td>{user.firstName} {user.lastName}</td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>{user.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <b><p>Address:</p></b>
          <table className="table">
            <tbody>
              <tr>
                <td>Street:</td>
                <td>{user.address.streetAddress}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{user.address.city}</td>
              </tr>
              <tr>
                <td>State:</td>
                <td>{user.address.state}</td>
              </tr>
              <tr>
                <td>Zip:</td>
                <td>{user.address.zip}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
};

class UserData extends React.Component{
  render(){
      const {user, update, index} = this.props;
      return (
          <tr className = "test" onClick={() => update({ active: index, test: true })}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
          </tr>
      );
  };
};

class UserList extends React.Component{
  constructor(props) {
    super(props);
    this.sorted = { id: true, firstName: true, lastName: true, email: true, phone: true };
  }
  sort(type) {
    const { update, data } = this.props;
    const isSorted = this.sorted[type];
    let direction = isSorted ? 1 : -1;
    const sorted = [].slice.call(data).sort((a, b) => {
      if (a[type] === b[type]) { return 0; }
        return a[type] > b[type] ? direction : direction * -1;
      });
    this.sorted[type] = !isSorted;

    update({
      items: sorted,
      active: 0
    });
  };
  render(){
    const {update, data} = this.props;
    if (!data) { return (<div>Loading...</div>); }
    const users = data.map((user, index) => {
      return (<UserData user={user} index={index} key={index} update={update} />);
    });

    return (
      <table>
        <thead>
          <tr>
            <th onClick={() => this.sort('id')}>ID</th>
            <th onClick={() => this.sort('firstName')}>Name</th>
            <th onClick={() => this.sort('lastName')}>LastName</th>
            <th onClick={() => this.sort('email')}>eMail</th>
            <th onClick={() => this.sort('phone')}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users}
        </tbody>
      </table>
    );
  };
};

class SearchBar extends React.Component{
  render(){
    const {data, update } = this.props;
    const dataSearch = e => {
      const value = e.target.value.toLowerCase();
      const filter = data.filter(user => {
          return user.firstName.toLowerCase().includes(value);
      });

      update({
        items: filter,
      });
    };
    return (
        <div className="search" >
            <input
                type="text"
                className="search"
                placeholder="Search people by name..."
                onChange={dataSearch}/>
        </div>
    );
  };
};

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        items: [],
        active: null,
        test: false,
      };
    }
     handleClick(){
      this.setState({
        test: false,
      })
     }
     componentDidMount() {
       fetch("http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}")
        .then(res => res.json())
        .then(
          (result) => {
            this.initialData =  result;
            this.setState({
              isLoaded: true,
              items: this.initialData
            });

          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
      };
      updateData(config) {
          this.setState(config);
          console.log(config);
      };
      render() {
        const { error, isLoaded  } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="content" >
                    <SearchBar                    
                        data={this.initialData}
                        update={this.updateData.bind(this)} />
                    <div className="mainInfo">
                        <UserList data={this.state.items}
                                  update={this.updateData.bind(this)}
                                  initialData={this.initialData}/>
                    </div>
                    <div className={this.state.test ? "popup" : null}>
                        <div onClick = {()=>this.handleClick()}>
                            {this.state.test ? <ActiveUser data={this.state.items} active={this.state.active} /> : null}
                        </div>
                    </div>
                </div>
            );
         }
       }
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
