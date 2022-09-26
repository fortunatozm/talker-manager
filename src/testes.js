const validDate = (watchedAt) => {
    const vectData = watchedAt.split('/');
    if (vectData.length === 3) {
      if (vectData[0].length === 2 && vectData[1].length === 2 && vectData[2].length === 4) {
        return true;
      } return false;
    } return false;
  };

console.log(validDate('90/02/1988'));