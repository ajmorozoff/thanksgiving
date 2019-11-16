/* eslint-disable react/button-has-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
console.log('hello world');
const root = document.getElementById('root');

const { Component } = React;

class App extends Component {
    constructor(props) {
        super();
        this.state = {
            people: [],
            dishes: [],
            selectedPerson: '',
            selectedDish: '',
        }
    }
    async componentDidMount() {
        await this.fetchData();
    }

    async fetchData() {
        const [people, dishes] = await Promise.all([
            axios.get('/api/people').then(res => res.data),
            axios.get('/api/dishes').then(res => res.data)
        ])
        dishes.map(dish => {
            if (dish.personId) {
                dish.person = people.find(person => person.id === dish.personId);
            }
        });
        this.setState({ people, dishes });
    }

    updateSelectedDish = (dish) => {
        if (this.state.selectedDish === dish) {
            this.state.selectedDish = '';
        }
        else {
            this.setState({selectedDish: dish})
        }
    }

    updateSelectedPerson = (person) => {
        if (this.state.selectedPerson === person) {
            this.state.selectedPerson = '';
        }
        else {
            this.setState({selectedPerson: person})
        }
        
    }

    updateAttendance = async(person) => {
        const resp = await axios.put(`/api/people/${person.id}`, {...person, isAttending: !person.isAttending});
        this.fetchData();
    }

    updateOwner = async(dish, person) => {
        const resp = await axios.put(`/api/dishes/${dish.id}`, {...dish, personId: person.id});
        this.fetchData();
    }

    deletePerson = async(id) => {
        const resp = await axios.delete(`/api/people/${id}`);
        this.fetchData();
    }

    deleteDish = async(id) => {
        const resp = await axios.delete(`/api/dishes/${id}`);
        this.fetchData();
    }

    addNewPerson = async(name) => {
        const resp = await axios.post('/api/people/', { name: name, isAttending: true });
        this.fetchData();
    }

    addNewDish = async(name, desc) => {
        if (!desc) {desc = 'no dish description';}
        const resp = await axios.post('/api/dishes', {name: name, description: desc});
        this.fetchData();
    }

    render() {
        const {dishes, people} = this.state;
        if (dishes.length || people.length) {
            return (
                <div id="app" className="app-container">
                    <DishList dishes={dishes} addNewDish={this.addNewDish} deleteDish={this.deleteDish} />
                    <PersonList people={people} addNewPerson={this.addNewPerson} deletePerson={this.deletePerson} updateAttendance={this.updateAttendance} />
                </div>
            )
        }
        else {
            return <div id="app" >Loading...</div>
        }
    }
}

class DishList extends Component {
    constructor(props) {
        super();
        this.state = {
            newName: '',
            newDesc: '',
        }
    }

    handleClick = () => {
        this.props.addNewDish(this.state.newName, this.state.newDesc);
        this.setState({
            newName: '',
            newDesc: ''
        })
    }

    render() {
        const { dishes, addNewDish, deleteDish } = this.props;
        const { newName, newDesc } = this.state;
        return (
            <div id="dish-list" className="list-container">
                <h1>Dishes for the Party</h1>
                <input name="dish-name" value={newName} onChange={(ev) => this.setState({newName: ev.target.value})} /><br />
                <input name="dish-desc" className="large-input" value={newDesc} onChange={(ev) => this.setState({newDesc: ev.target.value})} /><br />
                <button onClick={() => this.handleClick()} disabled={newName ? '' : 'disabled'}>Add</button>
                <ul>
                {
                    dishes.map(dish => <DishItem key={dish.id} dish={dish} deleteDish={deleteDish} />)
                }
                </ul>
            </div>
        )
    }
}

class DishItem extends Component {
    constructor(props) {
        super();
        this.state = {
            selected: false,
        }
    }
    toggleSelection = (ev) => {
        ev.preventDefault();
        this.setState({selected: !this.state.selected})
    }

    submitDelete = (ev, dish) => {
        ev.stopPropagation();
        this.props.deleteDish(dish.id);
    }

    render() {
        const { dish, deleteDish } = this.props;
        return (
            <div className={this.state.selected ? "dish-item selected" : "dish-item"} onClick={(ev) => this.toggleSelection(ev)}>
                <h2>{dish.name}</h2>
                <p>{dish.description}</p>
                <p>Owned by {dish.personId ? dish.person.name : 'nobody'}</p>
                <button onClick={(ev) => this.submitDelete(ev, dish)}>Remove Dish</button>
            </div>
        )
    }
}

class PersonList extends Component {
    constructor(props) {
        super();
        this.state = {
            newName: '',
        }
    }

    handleClick = () => {
        this.props.addNewPerson(this.state.newName);
        this.setState({
            newName: '',
        })
    }

    render() {
        const { newName } = this.state;
        const { people, deletePerson, updateAttendance} = this.props;
        return (
            <div id="person-list" className="list-container">
                <h1>Party Invite List</h1>
                <input name="add-invitee" value={newName} onChange={(ev) => this.setState({newName: ev.target.value})} />
                <button onClick={() => this.handleClick()} disabled={newName ? '' : 'disabled'}>Add</button>
                <ul>
                {
                    people.map(person => <PersonItem key={person.id} person={person} deletePerson={deletePerson} updateAttendance={updateAttendance} />)
                }
                </ul>
            </div>
        )
    }
}

const PersonItem = (props) => {
    const { person, deletePerson, updateAttendance } = props;
    return (
        <div className="person-item">
            <h2>{person.name}</h2>
            <p>Attending: {person.isAttending ? 'yes' : 'no'}</p>
            <button onClick={() => deletePerson(person.id)}>Remove from list</button>
            <button onClick={() => updateAttendance(person)}>Toggle Attendance</button>
        </div>
    )
}

ReactDOM.render(<App />, root);
