import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

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

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatePermissions($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name
            email
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
                                    <UserPermissions
                                        key={user.id}
                                        user={user}
                                    />
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
            permissions: PropTypes.array,
        }).isRequired,
    };
    state = {
        permissions: this.props.user.permissions,
    };
    handlePermissionChange = (e) => {
        const checkbox = e.target;
        // take a copy of the current permissions
        let updatedPermissions = [...this.state.permissions];
        // figure out if we need to remove or add this permission
        if (checkbox.checked) {
            // add it in!
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(
                (permission) => permission !== checkbox.value
            );
        }
        this.setState({ permissions: updatedPermissions });
    };
    render() {
        const user = this.props.user;
        return (
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id,
                }}
            >
                {(updatePermissions, { loading, error }) => (
                    <>
                        {error && (
                            <tr>
                                <td colSpan="8">
                                    <Error error={error} />
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermissions.map((permission) => (
                                <td key={permission}>
                                    <label
                                        htmlFor={`${user.id}-permission-${permission}`}
                                    >
                                        <input
                                            id={`${user.id}-permission-${permission}`}
                                            type="checkbox"
                                            checked={this.state.permissions.includes(
                                                permission
                                            )}
                                            value={permission}
                                            onChange={
                                                this.handlePermissionChange
                                            }
                                        />
                                    </label>
                                </td>
                            ))}
                            <td>
                                <SickButton
                                    type="button"
                                    disabled={loading}
                                    onClick={updatePermissions} 
                                    // can change above to inline function and pass in second param to call render prop func 
                                >
                                    Updat{loading ? "ing" : "e"}
                                </SickButton>
                            </td>
                        </tr>
                    </>
                )}
            </Mutation>
        );
    }
}

export default Permissions;
