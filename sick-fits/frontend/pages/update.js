import Link from 'next/link';
import UpdateItem from '../components/UpdateItem';

// Destructure props inline kinda nifty (b/c we put query on props @ the _app level)
const Sell = ({query}) => (
    <UpdateItem id={query.id}></UpdateItem>
)
export default Sell;