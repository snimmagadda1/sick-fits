import Link from 'next/link';
import Items from '../components/Items'

const Home = (props) => (
    <div>
        <Items page={parseFloat(props.query.page) || 1}></Items>
    </div>
)
export default Home;