import {calcTableMatrix} from "../../../utils/domUtils";

export default function(table, selected, styles){

    const padding = `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingRight}`;
    const verticalAlign = `${styles.verticalAlign}`;
    const backgroundColor = `${styles.backgroundColor}`;
    selected.forEach((node)=>{
        !!padding && (node.style.padding = padding);
        !!verticalAlign && (node.style.verticalAlign = verticalAlign);
        !!backgroundColor && (node.style.backgroundColor = backgroundColor);
    })

    const matrix = calcTableMatrix(table);
    const { sRowIdx, eRowIdx, sColIdx, eColIdx } = matrix.getPosition(selected);

    //가로선
    for(let i = sColIdx; i <= eColIdx; i++){
        if(matrix[sRowIdx][i].colSpan === 1){
            matrix[sRowIdx][i].node.style.borderTopStyle = styles.borderTopStyle;
            matrix[sRowIdx][i].node.style.borderTopWidth = styles.borderTopWidth;
            matrix[sRowIdx][i].node.style.borderTopColor = styles.borderTopColor;
        }
        if(sRowIdx > 0 && matrix[sRowIdx - 1][i].colSpan === 1){
            matrix[sRowIdx - 1][i].node.style.borderBottomStyle = styles.borderTopStyle;
            matrix[sRowIdx - 1][i].node.style.borderBottomWidth = styles.borderTopWidth;
            matrix[sRowIdx - 1][i].node.style.borderBottomColor = styles.borderTopColor;
        }

        for( let j = sRowIdx; j < eRowIdx; j++ ){
            if(matrix[j][i].colSpan === 1){
                matrix[j][i].node.style.borderBottomStyle = styles.borderCenterHorizontalStyle;
                matrix[j][i].node.style.borderBottomWidth = styles.borderCenterHorizontalWidth;
                matrix[j][i].node.style.borderBottomColor = styles.borderCenterHorizontalColor;
            }
            if( matrix[j + 1][i].colSpan === 1){
                matrix[j + 1][i].node.style.borderTopStyle = styles.borderCenterHorizontalStyle;
                matrix[j + 1][i].node.style.borderTopWidth = styles.borderCenterHorizontalWidth;
                matrix[j + 1][i].node.style.borderTopColor = styles.borderCenterHorizontalColor;
            }
        }

        if(matrix[eRowIdx][i].colSpan === 1){
            matrix[eRowIdx][i].node.style.borderBottomStyle = styles.borderBottomStyle;
            matrix[eRowIdx][i].node.style.borderBottomWidth = styles.borderBottomWidth;
            matrix[eRowIdx][i].node.style.borderBottomColor = styles.borderBottomColor;
        }
        if(eRowIdx < matrix.length - 1 && matrix[eRowIdx + 1][i].colSpan === 1){
            matrix[eRowIdx + 1][i].node.style.borderTopStyle = styles.borderBottomStyle;
            matrix[eRowIdx + 1][i].node.style.borderTopWidth = styles.borderBottomWidth;
            matrix[eRowIdx + 1][i].node.style.borderTopColor = styles.borderBottomColor;
        }
    }
    //우측, 좌측
    for(let i = sRowIdx; i <= eRowIdx; i++){
        if(matrix[i][sColIdx].rowSpan === 1){
            matrix[i][sColIdx].node.style.borderLeftStyle = styles.borderLeftStyle;
            matrix[i][sColIdx].node.style.borderLeftWidth = styles.borderLeftWidth;
            matrix[i][sColIdx].node.style.borderLeftColor = styles.borderLeftColor;
        }
        if(sColIdx > 0 && matrix[i][sColIdx - 1].rowSpan === 1){
            matrix[i][sColIdx - 1].node.style.borderRightStyle = styles.borderLeftStyle;
            matrix[i][sColIdx - 1].node.style.borderRightWidth = styles.borderLeftWidth;
            matrix[i][sColIdx - 1].node.style.borderRightColor = styles.borderLeftColor;
        }

        for( let j = sColIdx; j < eColIdx; j++ ){
            if(matrix[i][j].rowSpan === 1){
                matrix[i][j].node.style.borderRightStyle = styles.borderCenterVerticalStyle;
                matrix[i][j].node.style.borderRightWidth = styles.borderCenterVerticalWidth;
                matrix[i][j].node.style.borderRightColor = styles.borderCenterVerticalColor;
            }
            if( matrix[i][j + 1].rowSpan === 1){
                matrix[i][j + 1].node.style.borderLeftStyle = styles.borderCenterVerticalStyle;
                matrix[i][j + 1].node.style.borderLeftWidth = styles.borderCenterVerticalWidth;
                matrix[i][j + 1].node.style.borderLeftColor = styles.borderCenterVerticalColor;
            }
        }

        if(matrix[i][eColIdx].rowSpan === 1){
            matrix[i][eColIdx].node.style.borderRightStyle = styles.borderRightStyle;
            matrix[i][eColIdx].node.style.borderRightWidth = styles.borderRightWidth;
            matrix[i][eColIdx].node.style.borderRightColor = styles.borderRightColor;
        }
        if(sColIdx < matrix[0].length - 1 && matrix[i][sColIdx + 1].rowSpan === 1){
            matrix[i][eColIdx - 1].node.style.borderLeftStyle = styles.borderRightStyle;
            matrix[i][eColIdx - 1].node.style.borderLeftWidth = styles.borderRightWidth;
            matrix[i][eColIdx - 1].node.style.borderLeftColor = styles.borderRightColor;
        }
    }
}