const itemId = req.params.id;
        console.log(itemId)
        const newData = req.body; // Assuming the request body contains the updated data
        console.log(newData)

        const file_name = `${currentDate.getMonth()}-${(currentDate.getDay() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}.${req.file.filename}`
        
        const time = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}.${currentDate.getMilliseconds().toString().padStart(6, '0')}`;
        
        newData.file_name = file_name;
        newData.time = time;

        const result = await db.query('UPDATE upload_photo SET ? WHERE id = ?',[newData, itemId]);
        if (!result) {
            return res.status(404).send('File submit error')
        }
        res.send("Successfully updated")