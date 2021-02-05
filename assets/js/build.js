 
var aText = {'xText': [{'y': 0, 'data-id': 'income', 'text': 'Household Income (median)', 'class': 'x inactive'},{'y': -25, 'data-id': 'age','text': 'Age (median)','class': 'x inactive'},{'y': -50, 'data-id': 'poverty', 'text': 'In Poverty (%)','class': 'x active'}],'yText': [{'y': 0, 'data-id': 'obesity','text': 'Obese (%)','class': 'y active'},{'y': 25, 'data-id': 'smokes','text': 'Smokes (%)','class': 'y inactive'},{'y': 50, 'data-id': 'poverty','text': 'Lacks Healthcare (%)','class': 'y inactive'}]};

    Object.enteries(aText).forEach(([key,val])=>{
        if(key=='xText'){
            val.forEach(obj => {
                Object.enteries(([k,v])=>{
                    xText.attr(k,v)
                });
            });
        };
    });

