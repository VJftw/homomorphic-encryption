<?php

namespace spec\AppBundle\Entity;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * Class ComputationSpec
 * @package spec\AppBundle\Entity
 */
class ComputationSpec extends ObjectBehavior
{

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Entity\Computation');
    }

    function it_should_return_the_id()
    {
        $this->getId()
            ->shouldReturn(null)
        ;
    }

    function it_should_return_the_hash_id()
    {
        $this->getHashId()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_hash_id()
    {
        $this->setHashId("AxB43")
            ->shouldReturn($this)
        ;

        $this->getHashId()
            ->shouldReturn("AxB43")
        ;
    }

    function it_should_return_the_scheme()
    {
        $this->getScheme()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_scheme()
    {
        $this->setScheme("Pailler")
            ->shouldReturn($this)
        ;

        $this->getScheme()
            ->shouldReturn("Pailler")
        ;
    }

    function it_should_return_the_operation()
    {
        $this->getOperation()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_operation()
    {
        $this->setOperation("+")
            ->shouldReturn($this)
        ;

        $this->getOperation()
            ->shouldReturn("+")
        ;
    }

    function it_should_return_a_encrypted()
    {
        $this->getAEncrypted()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_a_encrypted()
    {
        $this->setAEncrypted(123124113)
            ->shouldReturn($this)
        ;

        $this->getAEncrypted()
            ->shouldReturn(123124113)
        ;
    }

    function it_should_return_b_encrypted()
    {
        $this->getBEncrypted()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_b_encrypted()
    {
        $this->setBEncrypted(1231241133)
            ->shouldReturn($this)
        ;

        $this->getBEncrypted()
            ->shouldReturn(1231241133)
        ;
    }

    function it_should_return_the_public_key()
    {
        $this->getPublicKey()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_public_key()
    {
        $this->setPublicKey('{"a": "123"}')
            ->shouldReturn($this)
        ;

        $this->getPublicKey()
            ->shouldReturn('{"a": "123"}')
        ;
    }

    function it_should_return_the_stages()
    {
        $this->getStages()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_stages()
    {
        $this->setStages(["aa"])
            ->shouldReturn($this)
        ;

        $this->getStages()
            ->shouldReturn(["aa"])
        ;
    }

    function it_should_return_the_timestamp()
    {
        $this->getTimestamp()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_timestamp()
    {
        $dateTime = new \DateTime('2015-04-03');
        $this->setTimestamp($dateTime)
            ->shouldReturn($this)
        ;

        $this->getTimestamp()
            ->shouldReturn($dateTime)
        ;
    }

    function it_should_return_the_ip_address()
    {
        $this->getIpAddress()
            ->shouldReturn(null)
        ;
    }

    function it_should_set_the_ip_address()
    {
        $this->setIpAddress("127.0.0.1")
            ->shouldReturn($this)
        ;

        $this->getIpAddress()
            ->shouldReturn("127.0.0.1")
        ;
    }
}
