export default function Counter1 ({value, onClick}) {
    if(value > 3){
        throw new Error('too many counts..')
    }
    return (
        <>
        <h2>Counter 1 is:  </h2>
        <h3>{value}</h3>
        <button onClick={onClick}>Increment1</button>
        </>
    )
}
