export default function Counter2 ({value, onClick}) {
        return (
            <>
            <h1>Counter 2 is : </h1>
            <h3>{value}</h3>
            <button onClick={onClick}>Increment2</button>
            </>
        )
}