function post(name, score) 
{
	var hiddenForm = document.createElement("form");
	hiddenForm.name = 'leaderboardForm';
	hiddenForm.method = 'POST';
	hiddenForm.action = 'http://54.171.162.97:8000/addleaderboard';
	
	if(name != 0 && time != 0) 
	{
		
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "name");
		hiddenField.setAttribute("value", name ]);
		form.appendChild(hiddenField);
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "score");
		hiddenField.setAttribute("value", score ]);
		form.appendChild(hiddenField);
	}    
    document.body.appendChild(hiddenForm);
    form.submit();
}

function read()
{
	
}