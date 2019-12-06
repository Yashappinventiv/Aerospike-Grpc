local function givenData(rec)
    local xrec = map()
    for i, bin_name in ipairs(record.bin_names(rec)) do
        xrec[bin_name] = rec[bin_name]
    end
    return xrec
end


function matchRecords(stream , name , age)
    
    local function nameMatch(rec)
       local val = rec['name'] 
       if val == name then
          return true
       else
          return false   
    end
end

    local function ageMatch(rec)
        local val = rec['age']
        if val == age then
            return true
        else
            return false
    end
end
    return stream : filter(nameMatch) : filter(ageMatch) : map(givenData)
end
