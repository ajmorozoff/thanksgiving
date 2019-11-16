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
        }
    }
    async componentDidMount() {
        const [people, dishes] = await Promise.all([
            axios.get('/api/people').then(res => res.data),
            axios.get('/api/dishes').then(res => res.data)
        ])
        this.setState({ people, dishes });
    }

    render() {
        if (this.state.dishes.length) {
            return (
                <div id="app" className="app-container">
                    <DishList dishes={this.state.dishes} />
                    <PersonList people={this.state.people} />
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
            dishes: props.dishes,
        }
    }
    render() {
        return (
            <div id="dish-list" className="list-container">
                <h1>Dishes for the Party</h1>
                <ul>
                {
                    this.state.dishes.map(dish => <DishItem key={dish.id} dish={dish} />)
                }
                </ul>
            </div>
        )
    }
}

//TODO: lift calculating ownership up to parent component, pass down a prop "owned by"
const DishItem = (props) => {
    const { name, description, personId} = props.dish;
    return (
        <div className="dish-item">
            <h2>{name}</h2>
            <p>{description}</p>
            <p>Owned by {personId ? personId : 'nobody'}</p>
        </div>
    )
}

class PersonList extends Component {
    constructor(props) {
        super();
        this.state = {
            people: props.people,
        }
    }
    render() {
        return (
            <div id="person-list" className="list-container">
                <h1>Party Invite List</h1>
                <ul>
                {
                    this.state.people.map(person => <PersonItem key={person.id} person={person} />)
                }
                </ul>
            </div>
        )
    }
}

const PersonItem = (props) => {
    const { name, isAttending } = props.person;
    return (
        <div className="person-item">
            <h2>{name}</h2>
            <p>Attending: {isAttending ? 'yes' : 'no'}</p>
        </div>
    )
}

ReactDOM.render(<App />, root);
