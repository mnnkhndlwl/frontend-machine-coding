import { StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native';
import { useState,useEffect } from "react";


export default function App() {

  const cards = [1,2,3,4,5,6]

  
  const [currentCards,setCurrentCards] = useState([]);

  function shuffleCards () {
     const shuffledCards = cards.concat(cards).sort(() => Math.random() - 0.5 );
     setCurrentCards(shuffledCards.map((item,index)=>{
       return {
         id: index,
         value: item,
         isFlipped:false,
         isMatched:false 
       }
     }))
  }

  useEffect(()=>{
    shuffleCards();
  },[])

  const handleCardClick = (item) => {
      
      if(item.isMatched || item.isFlipped) return;

      item.isFlipped = true;
      let cards = currentCards;
      cards[item.id] = item
     // setCurrentCards([...cards])

      const matchedCard = cards.filter((i) => i.isFlipped === true && i.value === item.value && i.id !== item.id);

      const totalFlippedAndUnmatchedCards = cards.filter((i) => i.isFlipped && !i.isMatched).length

      console.log("totalFlipped",totalFlippedAndUnmatchedCards,matchedCard)

      if(matchedCard.length === 0 && totalFlippedAndUnmatchedCards >= 2 ) {
          const updatedCards = cards.map((i)=> {
          if(!i.isMatched && i.isFlipped ) {
            return {...i,isFlipped:false}
          } else {
            return {...i}
          }
        } )
       
        setCurrentCards([...updatedCards])
      } else if (totalFlippedAndUnmatchedCards >= 2 ) {
        item.isMatched=true;
        cards[item.id] = item;
        cards[matchedCard[0].id].isMatched = true
        setCurrentCards([...cards]);
      } else {
        setCurrentCards([...cards])
      }

  }

  const renderItem = ({item,index}) => {
    return <TouchableOpacity style={{
      padding: 16
    }} onPress={ () => handleCardClick(item)} >
      <Text>{ item.isFlipped ? item.value : "?" }</Text>
    </TouchableOpacity>
  }


  return (
    <View>
     
    <FlatList data={currentCards} numColumns={3} renderItem={renderItem} />

    </View>
  );
}

const styles = StyleSheet.create({
  
});
