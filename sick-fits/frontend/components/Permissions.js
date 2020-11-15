import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "./styles/Table";
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE",
];

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

// Permissions will loop over all the users and hold the state for 
// a given user in the UserPermissions component's state 
const Permissions = (props) => (
    <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) =>
            console.log(data) || (
                <div>
                    <Error error={error}></Error>
                    <div>
                        <h2>Manage Permissions</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    {possiblePermissions.map((permission) => (
                                        <th key={permission}>{permission}</th>
                                    ))}
                                    <th> -></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((user) => (
                                    <UserPermissions key={user.id} user={user} />
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )
        }
    </Query>
);

// Move the row logic to a new component b/c will have heavy logic
// this new compnent will give table row / headers
class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array
        }).isRequired,
    };

    // This is ok.. b/c we are seeding the data in this case 
    state = {
        permissions: this.props.user.permissions
    };


    handlePermissionChange = (e) => {
        const checkBox = e.target;
        
        // take a copy of current permissions 
        // we don't want to mutate state directly so we copy w/ spread!
        let updatedPermissions = [...this.state.permissions];

        // figure out if we need to remove or add permission 
        if (checkBox.checked){
            updatedPermissions.push(checkBox.value);
        } else {
            updatedPermissions = updatedPermissions.filter( elem => elem !== checkBox.value);
        }
        this.setState({ permissions: updatedPermissions });
    }

    render() {
        const user = this.props.user;
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map((permission) => (
                    <td key={permission}>
                        <label htmlFor={`${user.id}-permission-${permission}`}>
                            <input 
                            id={`${user.id}-permission-${permission}`}
                            type="checkbox" 
                            checked={this.state.permissions.includes(permission)}
                            value={permission}
                            onChange={this.handlePermissionChange}/>
                        </label>
                    </td>
                ))}
                <td>
                    <SickButton>Update</SickButton>
                </td>
            </tr>
        );
    }
}

export default Permissions;
