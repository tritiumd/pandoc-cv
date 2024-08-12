---
font-size: $if(config.font-size)$$config.font-size$$else$11pt$endif$
font-family: $if(config.font-family)$$config.font-family$$else$Montserrat$endif$
font-weight: $if(config.font-weight)$$config.font-weight$$else$500$endif$
line-height: $if(config.line-height)$$config.line-height$$else$1.25$endif$
margin: $if(config.margin)$$config.margin$$else$0.5in$endif$
---
$if(name)$# $name$$endif$

$if(position)$## $position$$endif$

$if(info)$
::: {.horizontal-list}
$for(info)$
- []{.fa .$info.icon$} $info.data$
$endfor$
:::
$endif$

$if(summary)$
### Summary

$summary$
$endif$

$if(skill)$
### Skills

$for(skill)$
- $skill$
$endfor$
$endif$

$if(education)$
### Education

$for(education)$
#### $education.place$

##### $education.major$

###### $education.time$

$for(education.extra)$
- $education.extra$
$endfor$
$endfor$
$endif$

$if(certificate)$
### Certificates and Rewards

$for(certificate)$
##### $certificate.year$

##### $certificate.name$

$for(certificate.extra)$
- $certificate.extra$
$endfor$

$endfor$
$endif$

$if(experience)$
### Experience

$for(experience)$
#### $experience.place$

$for(experience.phase)$
##### $experience.phase.position$

###### $experience.phase.time$

$for(experience.phase.detail)$
- $experience.phase.detail$
$endfor$

$endfor$
$endfor$
$endif$

$if(activity)$
### Other Activity

$for(activity)$
#### $activity.place$

$for(activity.phase)$
##### $activity.phase.position$

###### $activity.phase.time$

$for(activity.phase.detail)$
- $activity.phase.detail$
$endfor$

$endfor$
$endfor$
$endif$

$if(reference)$
### Reference

$for(reference)$
#### $reference.name$

##### $reference.position$

- []{.fa .fa-phone} $reference.phone$
- []{.fa .fa-envelope} $reference.email$

$endfor$
$endif$