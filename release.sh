#!/bin/bash

# Print instructions for the script
intro() {
  printf "______________________ \n \n"
  printf "Welcome to the w3DS 4.0.0 command line helper script. \n"
	printf "This script will scan your application and update deprecated code when applicable. For more information on w3DS 4.0, visit https://pages.github.ibm.com/w3/w3ds/get-started/faqs \n \n"
  printf "______________________ \n \n"
}

# Detect user's bash version
detectBashVersion() {
  versionMatch=$(echo $(bash --version | head -1) | grep -o 'version 4\.[0-9]\.*')
  isVersionFour=${#versionMatch}
}

# Prompt user for directory in which to run the script
promptForDirectory() {
  printf "INSTRUCTIONS: \n"
  printf "Enter the name of the file or directory where you'd like to update your class names. Or, press enter to run the script recursively through your whole project. \n \n"
	read targetLocation
}

cleanUserInput() {
  # Set target location to root and set variable
  # tracking whether to recurse
	if [ -z "${targetLocation}" ]; then
		targetLocation="./"
		wholeProject=true
	fi

  # add dot if first char is fwd slash to 
  # prevent going to user's root dir
	if [ "${targetLocation: :1}" = "/" ]; then
		targetLocation=".${targetLocation}"
	fi

  # add trailing slash if not included
	if [ "${targetLocation: -1}" != "/" ]; then
		targetLocation="${targetLocation}/"
	fi
}

scanProject() {
  # If user input is directory, hit all files and subdirs
  if [ -d "${targetLocation}" ] || [ "${wholeProject}" = true ]; then
    for file in $(ls $targetLocation);
      do if [ "$file" != "$targetLocation" ]; then
        buildClasses "$targetLocation$file"
        ((fileCount++))
      fi
    done;
  # Otherwise just hit the file
  else
    buildClasses "$targetLocation"
    ((fileCount++))
  fi
}

# use class portions to create new / old pairs
cutClassPortions() {
  newType=$(echo $types | cut -d ":" -f 1)
  oldType=$(echo $types | cut -d ":" -f 2)

  newSide=$(echo $sides | cut -d ":" -f 1)
  oldSide=$(echo $sides | cut -d ":" -f 2)

  newName=$(echo $names | cut -d ":" -f 1)
  oldName=$(echo $names | cut -d ":" -f 2)
}

# Build classes dynamically
buildClasses() {
  printf "Trying Subdirectory... \n \n"
  typesMap=('pad:padding' 'mar:margin')
  sidesMap=('l:left' 'r:right' 't:top' 'b:bottom')
  renameMap=('flex-align-items-baseline:flex-align-baseline' 'flex-align-content-between:flex-align-between' 'flex-align-content-around':'flex-align-around' 'flex-col:flex-dir-col' 'flex-row:flex-dir-row' 'text-align:align-text' 'collapsible:collapsable')

  for types in "${typesMap[@]}"
    do for sides in "${sidesMap[@]}"
      do
        cutClassPortions $types $sides
        new="ds-$newType-$newSide"
        old="ds-$oldType-$oldSide"
        replaceClasses $old $new $1
    done
    cutClassPortions $types
    new="ds-$newType"
    old="ds-$oldType"
    replaceClasses $old $new $1
  done

  for sides in "${sidesMap[@]}"
    do
      cutClassPortions $sides
      new="ds-border-$newSide"
      old="ds-border-$oldSide"
      replaceClasses $old $new $1
  done

  for names in "${renameMap[@]}"
    do
      cutClassPortions $names
      new="ds-$newName"
      old="ds-$oldName"
      replaceClasses $old $new $1
  done
}

# Replace old class with new class in selected dir
replaceClasses() {
  # echo "Replacing $1 with $2 in $3"
  if [ -d "${3}" ]; then
    targetDir="$3/*"
    matchFound=$(git grep -l "$1" -- "$targetDir")
  else
    targetDir="$3"
    matchFound=$(git grep -l "$1" -- "$targetDir")
  fi

  # Actual replacement happens here
  if [ ! -z "$matchFound" ]; then
    printf "• Matches found in: \n$matchFound \n"
    if [ "$isVersionFour" -gt 0 ]; then
      sed -i -e "s/$1/$2/g" $matchFound
      ((++classCount))
      printf "[ $1 -> $2 ] \n \n"
			printf "Replacement successful 👍 \n \n"
      printf "____________________________________ \n \n"
    else
      sed -i '' -e "s/$1/$2/g" $matchFound
      ((++classCount))
      printf "[ $1 -> $2 ] \n \n"
			printf "Replacement successful 👍 \n \n"
      printf "____________________________________ \n \n"
    fi
  fi
}

# entry point
main() {
  intro
  detectBashVersion
  promptForDirectory
  cleanUserInput

  fileCount=0
  classCount=0

  startTime=$(date +%s)
  scanProject
  endTime=$(date +%s)

  printf "🎉 🎉  Script finished! 🎉 🎉 \n \n"
  printf "Replaced a total of $classCount classes across $fileCount files. \n"
  printf "This script took $((endTime - startTime)) seconds to run"
}

main
