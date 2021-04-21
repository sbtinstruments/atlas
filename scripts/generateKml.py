import urllib.request
import urllib.parse
import xml.dom.minidom
import json
import base64
import scrap_bot

def get_api_key(filename: str):
    with open(filename, 'r') as f:
        return f.readline()

def geocode(address, key, sensor=False):
    # This function queries the Google Maps API geocoder with an
    # address. It gets back a csv file, which it then parses and
    # returns a string with the longitude and latitude of the address.
    if key is None:
        return

    mapsKey = key
    mapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='
        
    # This joins the parts of the URL together into one string.
    url = ''.join([mapsUrl,urllib.parse.quote(address),'&sensor=',str(sensor).lower(),'&key=',mapsKey])
    print(url)
    with urllib.request.urlopen(url) as f:
        jsonOutput = f.read().decode('utf-8') # get the response
    
    # fix the output so that the json.loads function will handle it correctly
    result = json.loads(jsonOutput) # converts jsonOutput into a dictionary
    print(result)
    # check status is ok i.e. we have results (don't want to get exceptions)
    if result['status'] != "OK":
        return ""
    coordinates=result['results'][0]['geometry']['location'] # extract the geometry 
    return str(coordinates['lng'])+','+str(coordinates['lat'])

def appendStyle(style: str, kmlDoc, documentElement):
    # Style Top
    styleElement = kmlDoc.createElement('Style')
    styleAttr = kmlDoc.createAttribute('Style')
    styleAttr.name = 'id'
    styleAttr.value = style
    styleElement.setAttributeNode(styleAttr)
    documentElement.appendChild(styleElement)
    # Balloonstyle
    balloonElement = kmlDoc.createElement('BalloonStyle')
    styleElement.appendChild(balloonElement)
    ## Text
    textElement = kmlDoc.createElement('text')
    table_html = "<table style=\'color:white\'><tr><td><b>Owns</b></td><td>$[owns]</td></tr><tr><td><b>Sector</b></td><td>$[sector]</td></tr><tr><td><b>Address</b></td><td>$[location]</td></tr></table>"
    cdatasection =  kmlDoc.createCDATASection(table_html)
    textElement.appendChild(cdatasection)
    balloonElement.appendChild(textElement)
    ## BgColor
    bgElement = kmlDoc.createElement('bgColor')
    bgText = kmlDoc.createTextNode("#ff673005")
    bgElement.appendChild(bgText)
    balloonElement.appendChild(bgElement)
    ## textColor
    tcElement = kmlDoc.createElement('textColor')
    tcText = kmlDoc.createTextNode("#ffffffff")
    tcElement.appendChild(tcText)
    balloonElement.appendChild(tcElement)
    # Icon Style
    iconstyleElement = kmlDoc.createElement('IconStyle')
    styleElement.appendChild(iconstyleElement)
    ## Icon
    iconElement = kmlDoc.createElement('Icon')
    hrefElement = kmlDoc.createElement('href')
    link_str = '../balloons/bactobox.png'
    if style == "Cytoquant":
        link_str = '../balloons/cytoquant.png'
    hrefText = kmlDoc.createTextNode(link_str)
    hrefElement.appendChild(hrefText)
    iconElement.appendChild(hrefElement)
    iconstyleElement.appendChild(iconElement)
    ## scale
    scaleElement = kmlDoc.createElement('scale')
    scaleText = kmlDoc.createTextNode('10')
    scaleElement.appendChild(scaleText)
    iconstyleElement.appendChild(scaleElement)
    return kmlDoc, documentElement

def create_kml_header():
    """This function creates an XML document and adds the necessary KML elements."""
    kmlDoc = xml.dom.minidom.Document()
    kmlElement = kmlDoc.createElementNS("http://www.opengis.net/kml/2.2",'kml')
    kmlElement = kmlDoc.appendChild(kmlElement)
    documentElement = kmlDoc.createElement('Document')
    documentElement = kmlElement.appendChild(documentElement)
    # Style attributes
    kmlDoc, documentElement = appendStyle("Bactobox", kmlDoc, documentElement)
    kmlDoc, documentElement = appendStyle("Cytoquant", kmlDoc, documentElement)
    return kmlDoc, documentElement

def appendPlacemark(info, coordinates, kmlDoc, documentElement):
    """Creates a Placemark element that can then be appended to a kml file"""
    placemarkElement = kmlDoc.createElement('Placemark')
    # Name
    nameElement = kmlDoc.createElement('name')
    nameText = kmlDoc.createTextNode(info['name'])
    nameElement.appendChild(nameText)
    placemarkElement.appendChild(nameElement)
    # Style
    styleElement = kmlDoc.createElement('styleUrl')
    if info['owns'].startswith("bb"):        
        styleText = kmlDoc.createTextNode('#Bactobox')
        styleElement.appendChild(styleText)
    else:
        styleText = kmlDoc.createTextNode('#Cytoquant')
        styleElement.appendChild(styleText)
    placemarkElement.appendChild(styleElement)
    # Point
    pointElement = kmlDoc.createElement('Point')
    placemarkElement.appendChild(pointElement)
    ## Extrude
    extrudeElement = kmlDoc.createElement('extrude')
    extrudeElement.appendChild(kmlDoc.createTextNode('1'))
    pointElement.appendChild(extrudeElement)
    ## altitudemode
    altitudeElement = kmlDoc.createElement('altitudeMode')
    altitudeElement.appendChild(kmlDoc.createTextNode('absolute'))
    pointElement.appendChild(altitudeElement)
    ## coordinates
    coorElement = kmlDoc.createElement('coordinates')
    coorElement.appendChild(kmlDoc.createTextNode(coordinates+',3000000'))
    pointElement.appendChild(coorElement)
    # Extended data
    datum = ['address', 'sector', 'owns']
    extendeddataElement = kmlDoc.createElement('ExtendedData')
    placemarkElement.appendChild(extendeddataElement)
    for d in datum:
        dataElement = kmlDoc.createElement('Data')
        dataAttr = kmlDoc.createAttribute('Data')
        dataAttr.name = 'name'
        # We use a different attribute than 'address' since this is a keyword
        if d == 'address':
            dataAttr.value = 'location'
        else:
            dataAttr.value = d
        dataElement.setAttributeNode(dataAttr)
        extendeddataElement.appendChild(dataElement)
        # Value
        valueElement = kmlDoc.createElement('value')
        valueText = kmlDoc.createTextNode(info[d])
        valueElement.appendChild(valueText)
        dataElement.appendChild(valueElement)

    documentElement.appendChild(placemarkElement)
    return placemarkElement

def get_info():
    return {"name": "NovoZymes A/S",
            "address": "Krogshøjvej 36, 2880 Bagsværd",
            "owns": "bb2045020", 
            "sector": "Biotech"}    

def write_kml_file(kmlDoc,fileName: str):
    """This writes the KML Document to a file."""
    kmlFile = open(fileName, 'w')
    kmlFile.write(kmlDoc.toprettyxml(' '))  
    kmlFile.close()


if __name__ == '__main__':
    # Set up
    key = get_api_key('googleApiKey')
    kmlDoc, documentElement = create_kml_header()
    # Per-location
    for info in scrap_bot.get_records():
        coordinates = geocode(info['address'], key)
        placemarkElement = appendPlacemark(info, coordinates, kmlDoc, documentElement)    
    # Finish up
    write_kml_file(kmlDoc, '../data/kml/locations.kml')
