dragula([document.querySelector('.widgets-row'),
        document.querySelector('.widget-col')        
])

function addWidgetOpenDialog() {
    console.log('open')
    const widgetDialog = document.querySelector('#widgetDialog')
    widgetDialog.showModal()
}